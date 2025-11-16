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

//Interview

exports.startInterview = async (req, res) => {
  const { topic } = req.body;
  const sessionId = Date.now().toString(); // Unique session ID

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an AI interviewer for ${topic}.You are an AI interviewer specializing in computer science topics. Your task is to conduct interviews only on computer science-related subjects. If the provided topic is not related to computer science, you must respond with: 'I am only supposed to interview for computer science topics. Please enter a relevant topic.' Do not proceed with the interview unless the topic is within the domain of computer science.`,
        },
        {
          role: "user",
          content: `Ask an initial interview question about ${topic}.`,
        },
      ],
      model: "llama-3.1-8b-instant",
    });

    const initialQuestion = response.choices[0].message.content;

    // Save session to DB
    const newSession = new Session({
      sessionId,
      topic,
      questions: [{ question: initialQuestion }],
    });
    await newSession.save();

    res.json({ sessionId, question: initialQuestion });
  } catch (error) {
    console.error("Error generating initial question:", error);
    res.status(500).json({ error: "Failed to generate question" });
  }
};

exports.startInterview = async (req, res) => {
  const { topic } = req.body;
  const sessionId = Date.now().toString(); // Unique session ID

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an AI interviewer specializing in computer science topics. 
            Your task is to conduct interviews only on computer science-related subjects. If the provided topic is 
            not related to computer science, you must respond with: 'I am only supposed to interview for computer 
            science topics. Please enter a relevant topic.' Do not proceed with the interview unless the topic is within 
            the domain of computer science.`,
        },
        {
          role: "user",
          content: `Ask an initial interview question about ${topic}.`,
        },
      ],
      model: "llama-3.1-8b-instant",
    });

    const initialQuestion = response.choices[0].message.content;

    // Check if the AI responded with the alert message
    if (
      initialQuestion.includes(
        "I am only supposed to interview for computer science topics"
      )
    ) {
      return res.status(400).json({
        error: "Invalid topic. Please enter a computer science-related topic.",
      });
    }

    // Save session to DB
    const newSession = new Session({
      sessionId,
      topic,
      questions: [{ question: initialQuestion }],
    });
    await newSession.save();

    res.json({ sessionId, question: initialQuestion });
  } catch (error) {
    console.error("Error generating initial question:", error);
    res.status(500).json({ error: "Failed to generate question" });
  }
};

exports.answerInterview = async (req, res) => {
  const { sessionId, answer } = req.body;

  try {
    // Find session
    const session = await Session.findOne({ sessionId });
    if (!session) return res.status(404).json({ error: "Session not found" });

    const lastQuestion =
      session.questions[session.questions.length - 1].question;

    // Generate a follow-up question based on the user's answer
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an AI interviewer for ${session.topic}.`,
        },
        {
          role: "user",
          content: `Previous question: "${lastQuestion}". User answered: "${answer}". Ask a logical follow-up question.`,
        },
      ],
      model: "llama-3.1-8b-instant",
    });

    const followUpQuestion = response.choices[0].message.content;

    // Update session with the new question
    session.questions.push({
      question: lastQuestion,
      userAnswer: answer,
      followUp: followUpQuestion,
    });

    await session.save();

    res.json({ followUpQuestion });
  } catch (error) {
    console.error("Error generating follow-up question:", error);
    res.status(500).json({ error: "Failed to generate follow-up question" });
  }
};

exports.endInterview = async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await Session.findOne({ sessionId });
    if (!session) return res.status(404).json({ error: "Session not found" });

    res.json({ message: "Interview session ended.", sessionData: session });
  } catch (error) {
    console.error("Error ending interview:", error);
    res.status(500).json({ error: "Failed to end interview" });
  }
};

exports.interview = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email)
      return res.status(400).json({ error: "User email is required" });

    const interviews = await Interview.find({ email }).sort({ createdAt: -1 });
    res.json(interviews);
  } catch (error) {
    console.error("Error fetching interviews:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.saveInterview = async (req, res) => {
  try {
    const { email, sessionId, topic, chatHistory } = req.body;

    // Validate input
    if (!email || !sessionId || !topic || !chatHistory) {
      return res.status(400).json({ error: "❌ Missing required fields" });
    }

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Append date to topic
    const updatedTopic = `${topic} - ${today}`;

    // Save to MongoDB
    const newInterview = new Interview({
      email,
      sessionId,
      topic: updatedTopic,
      chatHistory,
    });

    await newInterview.save();

    res.status(201).json({ message: "✅ Interview saved successfully" });
  } catch (error) {
    console.error("❌ Error saving interview:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

exports.updateInterview = async (req, res) => {
  try {
    const { sessionId, chatHistory } = req.body;
    if (!sessionId || !chatHistory) {
      return res
        .status(400)
        .json({ error: "Missing sessionId or chatHistory" });
    }

    await Interview.findOneAndUpdate({ sessionId }, { chatHistory });
    res.json({ message: "Interview updated successfully" });
  } catch (error) {
    console.error("Error updating interview:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteInterview = async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId)
      return res.status(400).json({ error: "sessionId is required" });

    await Interview.findOneAndDelete({ sessionId });
    res.json({ message: "Interview deleted successfully" });
  } catch (error) {
    console.error("Error deleting interview:", error);
    res.status(500).json({ error: "Server error" });
  }
};
