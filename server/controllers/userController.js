// User controller logic
const User = require("../models/userModel");
const Subtopic = require("../models/subtopicModel");
const Feedback = require("../models/feedbackModel");
const VideoLink = require("../models/videoLinks");
const Badge = require("../models/badgeModel");
const Task = require("../models/tasksModel");
const Notes = require("../models/notesModel");
const Session = require("../models/interviewSessionModel");
const Interview = require("../models/interviewHistoryModel");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const Groq = require("groq-sdk");
const nodemailer = require("nodemailer");

const SECRET_KEY = config.SECRET_KEY;

exports.getSubtopics = async (req, res) => {
  try {
    const subtopics = await Subtopic.find();
    res.json(subtopics);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.addSubtopic = async (req, res) => {
  const { subject, subtopic, content } = req.body;
  const newSubtopic = new Subtopic({ subject, subtopic, content });
  try {
    await newSubtopic.save();
    res.status(201).json(newSubtopic);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.getSubtopicBySubjectAndName = async (req, res) => {
  const { subject, subtopic } = req.params;
  try {
    const subtopicData = await Subtopic.findOne({ subject, subtopic });
    if (!subtopicData) {
      return res.status(404).send("Subtopic not found");
    }
    res.json(subtopicData);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.addFeedback = async (req, res) => {
  const { name, email, subject, topic, feedbacks } = req.body;
  const update = { $set: { feedbacks, name, email, subject, topic } };

  try {
    const updatedFeedback = await Feedback.findOneAndUpdate(
      { email, subject, topic },
      update,
      { upsert: true, new: true }
    );
    res.status(201).json(updatedFeedback);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.getVideoLink = async (req, res) => {
  let { subject, topic } = req.params;
  subject = String(subject).toLowerCase();
  topic = String(topic).toLowerCase();
  try {
    const videoLink = await VideoLink.findOne({ subject, topic });
    if (!videoLink) {
      return res.status(404).send("Video link not found");
    }
    res.json(videoLink);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.addVideoLink = async (req, res) => {
  let { subject, topic, videoLink } = req.body;
  subject = String(subject).toLowerCase();
  topic = String(topic).toLowerCase();
  const newVideoLink = new VideoLink({ subject, topic, videoLink });
  try {
    await newVideoLink.save();
    res.status(201).json(newVideoLink);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.signUp = async (req, res) => {
  try {
    const { name, email, password, phone, college } = req.body;
    const hashedPassword = await bcrypt.hash(String(password), 10);
    console.log(hashedPassword);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      college,
    });
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      String(password),
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ name: user.name, email: user.email }, SECRET_KEY, {
      expiresIn: "24h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.validateJWT = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET_KEY);
    res.status(200).json({ message: "Token is valid" });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

exports.getBadges = async (req, res) => {
  try {
    const { email } = req.params;
    const badges = await Badge.findOne(
      { email },
      { _id: 0, __v: 0, "badges._id": 0 }
    );
    res.status(200).json(badges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addBadges = async (req, res) => {
  try {
    const { email, badges } = req.body;
    await Badge.findOneAndUpdate({ email }, req.body, { upsert: true });
    res.status(200).json({ message: "Badges added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addTask = async (req, res) => {
  try {
    const { email, task } = req.body;
    //    console.log(email, task);
    await Task.findOneAndUpdate(
      { email },
      { $addToSet: { tasks: task } },
      { upsert: true }
    );
    res.status(200).json({ message: "Task added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { email } = req.params;
    let tasks = await Task.findOne(
      { email },
      { _id: 0, __v: 0, "tasks._id": 0, email: 0 }
    );
    if (!tasks) tasks = [];
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    console.log(req.body);
    const { oldEmail, newEmail, name } = req.body;

    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(404).json({ message: "Email already exists" });
    }

    const update = {};

    if (newEmail) update.email = newEmail;
    update.name = name;

    const user = await User.findOneAndUpdate(
      { email: oldEmail },
      { $set: update },
      { new: true, runValidators: true }
    );

    res.status(200).json({ email: user.email, name: user.name });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      String(oldPassword),
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(String(newPassword), 10);
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const token = jwt.sign({ email: user.email }, SECRET_KEY, {
    expiresIn: "5m",
  });
  user.resetPasswordToken = token;
  await user.save();
  const resetLink = `${req.headers.origin}/setPassword/${token}`;

  // Nodemailer setup
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: "nmcgchatbot@gmail.com",
      pass: "ksvj dljn tzrv dmvi",
    },
  });

  // Send email with reset link
  const mailOptions = {
    from: "nmcgchatbot@gmail.com",
    to: email,
    subject: "Password Reset Request",
    html: `<p>Hello ${user.name},</p>
        <p>You have requested to reset your password. Click the link below to reset your password:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
      return res.status(500).json({ message: error });
    }

    // console.log('Email sent:', info.response);
    res.status(200).json({ message: "Password reset email sent successfully" });
  });
};

exports.setPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const isValidToken = jwt.verify(token, SECRET_KEY);

    const user = await User.findOne({ email: isValidToken.email });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been reset" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Password reset token is invalid or has expired",
        error: error.message,
      });
  }
};

exports.addNotes = async (req, res) => {
  try {
    const { email, subject, notes } = req.body;
    await Notes.findOneAndUpdate(
      { email, subject },
      { $set: { notes } },
      { upsert: true }
    );
    res.status(200).json({ message: "Notes added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const { email, subject } = req.params;
    // console.log(email);
    const notes = await Notes.findOne(
      { email, subject },
      { _id: 0, __v: 0, "notes._id": 0, email: 0, subject: 0 }
    );
    if (!notes) return res.status(404).json({ message: "Notes not found" });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const groq = new Groq({ apiKey: config.API_KEY });
const crypto = require("crypto");
const { toFile } = require("groq-sdk");

const INTERVIEW_MODEL = "qwen/qwen3.8-27b";
// Keep under Groq free-tier OTPM (1000) — interview replies should be short
const INTERVIEW_MAX_TOKENS = 200;
const SUMMARY_MAX_TOKENS = 150;
const FEEDBACK_MAX_TOKENS = 350;
const SUMMARY_REFRESH_EVERY = 2; // refresh LLM summary every N completed Q&A pairs

const INTERVIEWER_SYSTEM = (topic) => `You are a professional technical interviewer conducting a live interview on "${topic}".

Rules:
- Only cover computer science / software engineering topics related to "${topic}".
- Ask exactly ONE clear interview question at a time.
- Do not lecture, do not give the full answer, do not use markdown headings.
- Keep each question concise (1–3 sentences).
- Adapt difficulty based on the candidate's previous answers: go deeper if strong, clarify fundamentals if weak.
- Never repeat a question already asked in this conversation.
- Use the provided conversation summary for prior context — do not ask for the full transcript.
- Stay in character as the interviewer only.`;

const INVALID_TOPIC_MARKER =
  "I am only supposed to interview for computer science topics";

/** Dedicated CS-topic gate — runs before any interview session is created. */
const isComputerScienceTopic = async (topic) => {
  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You classify interview topics for a CS learning platform.
Reply with ONLY the single word YES or NO (nothing else).

YES if the topic is related to computer science, software engineering, programming, IT, or closely adjacent tech (examples: languages, frameworks, data structures, algorithms, databases, operating systems, networking, system design, web/mobile, DevOps, cybersecurity, machine learning / AI as CS topics, computer architecture, cloud, testing).

NO if it is unrelated (examples: cooking, sports, pure history, fashion, general medicine, travel, entertainment) or too vague to be a CS interview topic.`,
      },
      {
        role: "user",
        content: `Topic: "${topic}"`,
      },
    ],
    model: INTERVIEW_MODEL,
    max_tokens: 8,
    temperature: 0,
  });

  const text = (response.choices[0]?.message?.content || "")
    .trim()
    .toUpperCase();
  // Accept YES / YES. / "YES ..." — reject anything that isn't clearly affirmative
  return /^YES\b/.test(text);
};

const groqErrorResponse = (res, error, fallback) => {
  if (error?.status === 429 || error?.error?.code === "rate_limit_exceeded") {
    return res.status(429).json({
      error: "AI is busy right now (rate limit). Please wait a few seconds and try again.",
    });
  }
  return res.status(500).json({ error: fallback });
};

const truncate = (text = "", max = 180) => {
  const cleaned = String(text).replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max - 1)}…`;
};

/** Compact Q&A pairs from history (no raw dump). Last unpaired AI = current question. */
const buildLocalHistorySummary = (chatHistory = []) => {
  const pairs = [];
  let pendingQuestion = null;

  for (const msg of chatHistory) {
    if (!msg?.content) continue;
    if (msg.role === "AI") {
      pendingQuestion = msg.content;
    } else if (msg.role === "User") {
      pairs.push({
        question: truncate(pendingQuestion || "(prior question)", 160),
        answer: truncate(msg.content, 220),
      });
      pendingQuestion = null;
    }
  }

  const lines = pairs.map(
    (p, i) => `${i + 1}. Q: ${p.question}\n   A: ${p.answer}`
  );

  return {
    localSummary: lines.length
      ? lines.join("\n")
      : "No completed Q&A pairs yet.",
    pendingQuestion,
    completedPairs: pairs.length,
  };
};

const buildFollowUpMessages = (topic, priorSummary, lastQuestion, answer) => [
  { role: "system", content: INTERVIEWER_SYSTEM(topic) },
  {
    role: "user",
    content: `Topic: ${topic}

Prior interview summary (use this instead of a full transcript):
${priorSummary || "Interview just started."}

Latest interviewer question:
${lastQuestion || "(none)"}

Candidate's latest answer:
${answer}

Ask the next single follow-up interview question only. Do not repeat prior questions.`,
  },
];

/** LLM summary of compact transcript; falls back to local text on failure. */
const createConversationSummary = async (topic, chatHistory, previousSummary = "") => {
  const { localSummary, completedPairs } = buildLocalHistorySummary(chatHistory);
  if (completedPairs === 0) {
    return previousSummary || "Interview started; no answers yet.";
  }

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Summarize a technical interview on "${topic}" for another interviewer.
Return 4–8 short bullet points covering: topics already asked, what the candidate got right/wrong, and gaps to probe next.
Max 120 words. No questions. Plain text only.`,
        },
        {
          role: "user",
          content: `${previousSummary ? `Previous summary:\n${previousSummary}\n\n` : ""}Completed Q&A (compact):\n${localSummary}`,
        },
      ],
      model: INTERVIEW_MODEL,
      max_tokens: SUMMARY_MAX_TOKENS,
      temperature: 0.3,
    });
    const text = (response.choices[0].message.content || "").trim();
    return text || localSummary;
  } catch (error) {
    console.warn("Summary generation failed, using local compact summary:", error?.message || error);
    return localSummary;
  }
};

const syncInterviewHistory = async (session) => {
  await Interview.findOneAndUpdate(
    { sessionId: session.sessionId, email: session.email },
    {
      email: session.email,
      sessionId: session.sessionId,
      topic: session.topic,
      chatHistory: session.chatHistory,
      status: session.status,
      feedback: session.feedback || "",
      conversationSummary: session.conversationSummary || "",
    },
    { upsert: true, new: true }
  );
};

/** Load or rebuild a session without duplicate-key crashes on old records. */
const resolveSession = async (sessionId, email) => {
  const normalizedEmail = email ? email.trim().toLowerCase() : null;

  // Always look up by sessionId first — legacy sessions may have no email field
  let session = await Session.findOne({ sessionId });

  if (session) {
    if (
      normalizedEmail &&
      session.email &&
      session.email !== normalizedEmail
    ) {
      const err = new Error("Not allowed to access this session");
      err.status = 403;
      throw err;
    }

    // Attach email onto legacy sessions that never stored one
    if (normalizedEmail && !session.email) {
      session.email = normalizedEmail;
    }
  } else if (normalizedEmail) {
    const history = await Interview.findOne({
      sessionId,
      email: normalizedEmail,
    });

    if (history) {
      // Upsert so we never hit E11000 if a race creates the session
      session = await Session.findOneAndUpdate(
        { sessionId },
        {
          $setOnInsert: {
            sessionId: history.sessionId,
            email: history.email || normalizedEmail,
            topic: history.topic,
            chatHistory: history.chatHistory || [],
            status: history.status === "ended" ? "ended" : "active",
            feedback: history.feedback || "",
            conversationSummary: history.conversationSummary || "",
          },
        },
        { upsert: true, new: true }
      );
    }
  }

  if (!session) return null;

  // Heal missing chatHistory from Interview or legacy `questions` field
  if (!session.chatHistory?.length) {
    const history = await Interview.findOne({
      sessionId: session.sessionId,
      ...(session.email ? { email: session.email } : {}),
    });

    if (history?.chatHistory?.length) {
      session.chatHistory = history.chatHistory;
      if (!session.email && history.email) session.email = history.email;
      if (!session.topic && history.topic) session.topic = history.topic;
      if (history.status) session.status = history.status;
      if (history.feedback) session.feedback = history.feedback;
    } else if (Array.isArray(session._doc?.questions) && session._doc.questions.length) {
      const migrated = [];
      const seen = new Set();
      for (const q of session._doc.questions) {
        if (q.question && !seen.has(q.question)) {
          migrated.push({ role: "AI", content: q.question });
          seen.add(q.question);
        }
        if (q.userAnswer) {
          migrated.push({ role: "User", content: q.userAnswer });
        }
        if (q.followUp && !seen.has(q.followUp)) {
          migrated.push({ role: "AI", content: q.followUp });
          seen.add(q.followUp);
        }
      }
      session.chatHistory = migrated;
    }
  }

  return session;
};

// Interview

exports.startInterview = async (req, res) => {
  const { topic, email } = req.body;

  if (!topic?.trim()) {
    return res.status(400).json({ error: "Topic is required" });
  }
  if (!email?.trim()) {
    return res.status(400).json({ error: "User email is required" });
  }

  const cleanTopic = topic.trim();

  try {
    // 1) Validate CS relevance BEFORE creating any session or asking a question
    const isCsTopic = await isComputerScienceTopic(cleanTopic);
    if (!isCsTopic) {
      return res.status(400).json({
        error:
          "Invalid topic. Please enter a computer science or software engineering related topic.",
      });
    }

    // 2) Only now generate the first question and persist the session
    const sessionId = crypto.randomUUID();

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: INTERVIEWER_SYSTEM(cleanTopic),
        },
        {
          role: "user",
          content: `Start the interview on "${cleanTopic}". Ask your first question only.`,
        },
      ],
      model: INTERVIEW_MODEL,
      max_tokens: INTERVIEW_MAX_TOKENS,
      temperature: 0.7,
    });

    const initialQuestion = (response.choices[0].message.content || "").trim();

    if (
      !initialQuestion ||
      initialQuestion.includes(INVALID_TOPIC_MARKER)
    ) {
      return res.status(400).json({
        error:
          "Invalid topic. Please enter a computer science or software engineering related topic.",
      });
    }

    const chatHistory = [{ role: "AI", content: initialQuestion }];

    const newSession = new Session({
      sessionId,
      email: email.trim().toLowerCase(),
      topic: cleanTopic,
      chatHistory,
      status: "active",
    });
    await newSession.save();
    await syncInterviewHistory(newSession);

    res.json({
      sessionId,
      topic: cleanTopic,
      question: initialQuestion,
      chatHistory,
      status: "active",
    });
  } catch (error) {
    console.error("Error generating initial question:", error);
    return groqErrorResponse(res, error, "Failed to generate question");
  }
};

exports.answerInterview = async (req, res) => {
  const { sessionId, answer, email } = req.body;

  if (!sessionId || !answer?.trim()) {
    return res.status(400).json({ error: "sessionId and answer are required" });
  }

  try {
    let session;
    try {
      session = await resolveSession(sessionId, email);
    } catch (accessErr) {
      if (accessErr.status === 403) {
        return res.status(403).json({ error: accessErr.message });
      }
      throw accessErr;
    }

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.status === "ended") {
      return res.status(400).json({
        error: "This interview has ended. Start a new interview to continue.",
      });
    }

    if (!session.chatHistory?.length) {
      return res.status(400).json({
        error: "Interview has no conversation history. Please start a new interview.",
      });
    }

    const trimmedAnswer = answer.trim();
    const { localSummary, pendingQuestion, completedPairs } =
      buildLocalHistorySummary(session.chatHistory);

    // Prefer stored LLM summary; fall back to compact local Q&A summary
    let priorSummary = session.conversationSummary?.trim() || localSummary;

    // Refresh LLM summary periodically (not every turn) to stay under rate limits
    const shouldRefreshSummary =
      completedPairs > 0 &&
      (completedPairs === 1 ||
        completedPairs % SUMMARY_REFRESH_EVERY === 0 ||
        !session.conversationSummary);

    if (shouldRefreshSummary) {
      priorSummary = await createConversationSummary(
        session.topic,
        session.chatHistory,
        session.conversationSummary || ""
      );
      session.conversationSummary = priorSummary;
      session.summaryTurnCount = completedPairs;
    }

    const messages = buildFollowUpMessages(
      session.topic,
      priorSummary,
      pendingQuestion,
      trimmedAnswer
    );

    const response = await groq.chat.completions.create({
      messages,
      model: INTERVIEW_MODEL,
      max_tokens: INTERVIEW_MAX_TOKENS,
      temperature: 0.7,
    });

    const followUpQuestion = (response.choices[0].message.content || "").trim();

    session.chatHistory.push({ role: "User", content: trimmedAnswer });
    session.chatHistory.push({ role: "AI", content: followUpQuestion });

    // Cheap local append so the next turn has fresher context even before LLM refresh
    const lastQ = truncate(pendingQuestion || "", 140);
    const lastA = truncate(trimmedAnswer, 180);
    const appendLine = `- Covered: "${lastQ}" → candidate: "${lastA}"`;
    session.conversationSummary = session.conversationSummary
      ? `${session.conversationSummary}\n${appendLine}`
      : appendLine;
    // Keep summary from ballooning
    if (session.conversationSummary.length > 1800) {
      session.conversationSummary = session.conversationSummary.slice(-1800);
    }

    if (email && !session.email) {
      session.email = email.trim().toLowerCase();
    }
    await session.save();
    if (session.email) {
      await syncInterviewHistory(session);
    }

    res.json({
      followUpQuestion,
      chatHistory: session.chatHistory,
      status: session.status,
    });
  } catch (error) {
    console.error("Error generating follow-up question:", error);
    return groqErrorResponse(res, error, "Failed to generate follow-up question");
  }
};

exports.endInterview = async (req, res) => {
  const { sessionId, email } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: "sessionId is required" });
  }

  try {
    let session;
    try {
      session = await resolveSession(sessionId, email);
    } catch (accessErr) {
      if (accessErr.status === 403) {
        return res.status(403).json({ error: accessErr.message });
      }
      throw accessErr;
    }

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    let feedback = session.feedback;
    if (!feedback && (session.chatHistory || []).length > 0) {
      const { localSummary } = buildLocalHistorySummary(session.chatHistory);
      const summaryForFeedback =
        session.conversationSummary?.trim() ||
        (await createConversationSummary(
          session.topic,
          session.chatHistory,
          ""
        ));

      const response = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a senior technical interviewer writing brief post-interview feedback for topic "${session.topic}".
Be constructive and specific. Use short plain paragraphs or bullet-like lines. Cover: strengths, gaps, and what to study next. Keep under 160 words.`,
          },
          {
            role: "user",
            content: `Interview summary:\n${summaryForFeedback}\n\nCompact Q&A notes:\n${localSummary}\n\nWrite the feedback now.`,
          },
        ],
        model: INTERVIEW_MODEL,
        max_tokens: FEEDBACK_MAX_TOKENS,
        temperature: 0.5,
      });
      feedback = (response.choices[0].message.content || "").trim();
    }

    session.status = "ended";
    session.feedback = feedback || "Interview ended.";
    if (email && !session.email) {
      session.email = email.trim().toLowerCase();
    }
    await session.save();
    if (session.email) {
      await syncInterviewHistory(session);
    }

    res.json({
      message: "Interview session ended.",
      feedback: session.feedback,
      chatHistory: session.chatHistory,
      status: "ended",
      sessionData: session,
    });
  } catch (error) {
    console.error("Error ending interview:", error);
    return groqErrorResponse(res, error, "Failed to end interview");
  }
};

exports.interview = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: "User email is required" });
    }

    const interviews = await Interview.find({
      email: email.trim().toLowerCase(),
    }).sort({ createdAt: -1 });
    res.json(interviews);
  } catch (error) {
    console.error("Error fetching interviews:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.saveInterview = async (req, res) => {
  try {
    const { email, sessionId, topic, chatHistory, status, feedback } = req.body;

    if (!email || !sessionId || !topic || !chatHistory) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const saved = await Interview.findOneAndUpdate(
      { sessionId, email: normalizedEmail },
      {
        email: normalizedEmail,
        sessionId,
        topic: topic.trim(),
        chatHistory,
        status: status || "active",
        feedback: feedback || "",
      },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: "Interview saved successfully", interview: saved });
  } catch (error) {
    console.error("Error saving interview:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

exports.updateInterview = async (req, res) => {
  try {
    const { sessionId, chatHistory, email, status, feedback } = req.body;
    if (!sessionId || !chatHistory) {
      return res.status(400).json({ error: "Missing sessionId or chatHistory" });
    }

    const filter = { sessionId };
    if (email) filter.email = email.trim().toLowerCase();

    const updated = await Interview.findOneAndUpdate(
      filter,
      {
        chatHistory,
        ...(status ? { status } : {}),
        ...(feedback !== undefined ? { feedback } : {}),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Interview not found" });
    }

    await Session.findOneAndUpdate(
      { sessionId, ...(email ? { email: email.trim().toLowerCase() } : {}) },
      {
        chatHistory,
        ...(status ? { status } : {}),
        ...(feedback !== undefined ? { feedback } : {}),
      }
    );

    res.json({ message: "Interview updated successfully", interview: updated });
  } catch (error) {
    console.error("Error updating interview:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteInterview = async (req, res) => {
  try {
    const { sessionId, email } = req.query;
    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required" });
    }
    if (!email) {
      return res.status(400).json({ error: "email is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const deleted = await Interview.findOneAndDelete({
      sessionId,
      email: normalizedEmail,
    });

    if (!deleted) {
      return res.status(404).json({ error: "Interview not found" });
    }

    await Session.findOneAndDelete({
      sessionId,
      email: normalizedEmail,
    });

    res.json({ message: "Interview deleted successfully" });
  } catch (error) {
    console.error("Error deleting interview:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.transcribeAudio = async (req, res) => {
  try {
    const { audioBase64, mimeType } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: "audioBase64 is required" });
    }

    const buffer = Buffer.from(audioBase64, "base64");
    if (buffer.length < 1000) {
      return res.status(400).json({ error: "Recording too short" });
    }

    const type = mimeType || "audio/webm";
    const extension = type.includes("mp4")
      ? "mp4"
      : type.includes("ogg")
        ? "ogg"
        : "webm";

    const file = await toFile(buffer, `answer.${extension}`, { type });
    const result = await groq.audio.transcriptions.create({
      file,
      model: "whisper-large-v3-turbo",
      language: "en",
      response_format: "text",
    });

    const text = typeof result === "string" ? result.trim() : (result?.text || "").trim();
    res.json({ text });
  } catch (error) {
    console.error("Transcription error:", error);
    res.status(500).json({ error: "Failed to transcribe audio" });
  }
};
