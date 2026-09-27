const crypto = require("crypto");
const Groq = require("groq-sdk");
const config = require("../config/config");
const VideoLink = require("../models/videoLinks");
const Task = require("../models/tasksModel");
const Badge = require("../models/badgeModel");

const groq = new Groq({ apiKey: config.API_KEY });

const CONTENT_MODEL = "qwen/qwen3.8-27b";
const CONTENT_MAX_TOKENS = 900;
const QUIZ_TTL_MS = 60 * 60 * 1000; // 1 hour

/** In-memory quiz sessions: quizId -> { questions, subject, topic, topicId, email, createdAt } */
const quizStore = new Map();

const pruneQuizStore = () => {
  const now = Date.now();
  for (const [id, session] of quizStore.entries()) {
    if (now - session.createdAt > QUIZ_TTL_MS) {
      quizStore.delete(id);
    }
  }
};

const groqErrorResponse = (res, error, fallback) => {
  if (error?.status === 429 || error?.error?.code === "rate_limit_exceeded") {
    return res.status(429).json({
      error:
        "AI is busy right now (rate limit). Please wait a few seconds and try again.",
    });
  }
  console.error(fallback, error?.message || error);
  return res.status(500).json({ error: fallback });
};

const extractJsonArray = (text) => {
  const cleaned = String(text || "")
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON array in model response");
  }
  return JSON.parse(cleaned.slice(start, end + 1));
};

const badgeIdForTopic = (id) => {
  const n = Number.parseInt(id, 10);
  if (Number.isNaN(n)) return null;
  if ((n >= 6 && n <= 17) || (n >= 18 && n <= 23) || (n >= 24 && n <= 29)) {
    return n;
  }
  if (n === 4 || n === 5) return n;
  return null;
};

exports.generateContent = async (req, res) => {
  try {
    const { subject, topic } = req.body;
    if (!subject || !topic) {
      return res.status(400).json({ error: "subject and topic are required" });
    }

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Imagine you as a professional ${subject} teacher.
              Explain ${topic} from ${subject} in clear detail (about 500–700 words).
              Guidelines:
              Avoid including the main heading.
              Ensure the content is clear, concise, and easy to read.
              Maintain proper spacing between paragraphs.
              Use bold, italic, and strikethrough for emphasis where useful.
              Use headings for clarity and organization.
              Use bullet points, numbered lists, or subheadings where applicable.
              Use proper grammar, spelling, capitalization, and punctuation.
              Do not include references or citations.
            `,
        },
      ],
      model: CONTENT_MODEL,
      max_tokens: CONTENT_MAX_TOKENS,
      temperature: 0.6,
    });

    const content = response.choices[0]?.message?.content || "";
    if (!content) {
      return res.status(500).json({ error: "Empty AI response" });
    }
    res.json({ content });
  } catch (error) {
    return groqErrorResponse(res, error, "Failed to generate content");
  }
};

exports.chatTutor = async (req, res) => {
  try {
    const { subject, topic, query } = req.body;
    if (!subject || !topic || !query) {
      return res
        .status(400)
        .json({ error: "subject, topic, and query are required" });
    }

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `You are an expert ${subject} tutor specializing in ${topic}. Your role is to help students understand concepts clearly and concisely.

            CONTEXT: You have just explained the concept of ${topic}. A student is now asking: '${query}'

            GUIDELINES:
            1. Check if the query is relevant to ${topic} and ${subject}
            2. If relevant: Provide a clear, concise answer (max 800 words unless detailed explanation is requested)
            3. If irrelevant: Respond with "This question is outside the scope of our current topic. Let's focus on ${topic} related questions."
            4. For greetings (hello, hi, etc.) and farewells (bye, goodbye): Respond naturally as a helpful tutor
            5. Stay focused on the educational context - no extra explanations or off-topic content
            6. Use simple, student-friendly language appropriate for learning

            Remember: Your goal is to help students learn ${topic} effectively within the ${subject} domain.`,
        },
      ],
      model: CONTENT_MODEL,
      max_tokens: CONTENT_MAX_TOKENS,
      temperature: 0.5,
    });

    const content = response.choices[0]?.message?.content || "";
    res.json({ content });
  } catch (error) {
    return groqErrorResponse(res, error, "Failed to get AI response");
  }
};

exports.generateQuiz = async (req, res) => {
  try {
    const { subject, topic, topicId } = req.body;
    if (!subject || !topic) {
      return res.status(400).json({ error: "subject and topic are required" });
    }

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Imagine you as a professional ${subject} teacher.
                    You are in charge of generating 5  questions for ${topic} from ${subject}.
                    Questions should have the structure of: 
                    [
                        {
                            "question": "What is ...",
                            "options": ["option 1", "option 2", "option 3", "option 4"],
                            "correctAnswer": "correct option"
                        },
                        ...
                    ]
                    Do not add any additional context or explanation even the first line of response only give 5 questions as a javascript array, and don't answer the query if it's not related to the ${topic} and ${subject} being discussed.
                `,
        },
      ],
      model: CONTENT_MODEL,
      max_tokens: CONTENT_MAX_TOKENS,
      temperature: 0.4,
    });

    const raw = response.choices[0]?.message?.content || "";
    const quizArray = extractJsonArray(raw);
    if (!Array.isArray(quizArray) || quizArray.length === 0) {
      return res.status(500).json({ error: "Invalid quiz format from AI" });
    }

    const questions = quizArray.map((q) => ({
      question: String(q.question || ""),
      options: Array.isArray(q.options) ? q.options.map(String) : [],
      correctAnswer: String(q.correctAnswer || ""),
    }));

    pruneQuizStore();
    const quizId = crypto.randomUUID();
    quizStore.set(quizId, {
      questions,
      subject: String(subject),
      topic: String(topic),
      topicId: topicId != null ? String(topicId) : "",
      email: req.user.email,
      createdAt: Date.now(),
    });

    // Do not send correct answers until the quiz is submitted
    const publicQuestions = questions.map(({ question, options }) => ({
      question,
      options,
    }));

    res.json({ quizId, questions: publicQuestions });
  } catch (error) {
    if (error instanceof SyntaxError || error.message?.includes("JSON")) {
      return res.status(500).json({ error: "Failed to parse quiz questions" });
    }
    return groqErrorResponse(res, error, "Failed to generate quiz");
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, selectedOptions } = req.body;
    if (!quizId || !selectedOptions || typeof selectedOptions !== "object") {
      return res
        .status(400)
        .json({ error: "quizId and selectedOptions are required" });
    }

    const session = quizStore.get(quizId);
    if (!session) {
      return res.status(404).json({ error: "Quiz session expired or not found" });
    }
    if (session.email !== req.user.email) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { questions, subject, topic, topicId } = session;
    let score = 0;
    questions.forEach((q, index) => {
      const key = String(index);
      const answer =
        selectedOptions[key] !== undefined
          ? selectedOptions[key]
          : selectedOptions[index];
      if (answer === q.correctAnswer) score += 1;
    });

    let awarded = false;
    if (score === questions.length && questions.length > 0) {
      const task = `${subject}-${topic}`;
      await Task.findOneAndUpdate(
        { email: req.user.email },
        { $addToSet: { tasks: task } },
        { upsert: true }
      );

      const badgeId = badgeIdForTopic(topicId);
      if (badgeId != null) {
        const badgeDoc = await Badge.findOne({ email: req.user.email });
        if (badgeDoc?.badges?.length) {
          const badges = badgeDoc.badges.map((b) => {
            const plain = b.toObject ? b.toObject() : { ...b };
            if (plain.id === badgeId) {
              return { ...plain, count: (plain.count || 0) + 1 };
            }
            return plain;
          });
          await Badge.findOneAndUpdate(
            { email: req.user.email },
            { email: req.user.email, badges },
            { upsert: true }
          );
          awarded = true;
        }
      } else {
        awarded = true; // task completed even if no badge mapping
      }
    }

    // One-time use
    quizStore.delete(quizId);

    res.json({
      score,
      total: questions.length,
      questions,
      awarded,
    });
  } catch (error) {
    console.error("submitQuiz error:", error?.message || error);
    res.status(500).json({ error: "Failed to submit quiz" });
  }
};

exports.resolveVideoLink = async (req, res) => {
  try {
    let { subject, topic } = req.body;
    if (!subject || !topic) {
      return res.status(400).json({ error: "subject and topic are required" });
    }
    subject = String(subject).toLowerCase();
    topic = String(topic).toLowerCase();

    const existing = await VideoLink.findOne({ subject, topic });
    if (existing?.videoLink) {
      return res.json({ videoLink: existing.videoLink });
    }

    const ytKey = config.YT_API_KEY;
    if (!ytKey) {
      return res.status(503).json({
        error: "YouTube API is not configured on the server",
      });
    }

    const searchQuery = `"${topic} in ${subject}"`;
    const ytUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      searchQuery
    )}&key=${ytKey}&type=video&maxResults=1&order=relevance`;

    const ytRes = await fetch(ytUrl);
    if (!ytRes.ok) {
      const status = ytRes.status === 403 ? 503 : 502;
      return res.status(status).json({ error: "Failed to search YouTube" });
    }

    const data = await ytRes.json();
    const videoId = data?.items?.[0]?.id?.videoId;
    if (!videoId) {
      return res.status(404).json({ error: "No video found" });
    }

    const videoLink = `https://www.youtube.com/embed/${videoId}`;
    await VideoLink.findOneAndUpdate(
      { subject, topic },
      { subject, topic, videoLink },
      { upsert: true, new: true }
    );

    res.json({ videoLink });
  } catch (error) {
    console.error("resolveVideoLink error:", error?.message || error);
    res.status(500).json({ error: "Failed to resolve video link" });
  }
};
