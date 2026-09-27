import axios from "axios";

const url = import.meta.env.VITE_serverUrl;

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const authConfig = () => ({ headers: authHeaders() });

export const addContent = async (subject, subtopic, content) => {
  const response = await axios.post(
    url + "add-subtopic",
    { subject, subtopic, content },
    authConfig()
  );
  return response.data;
};

export const getContent = async (subject, subtopic) => {
  const response = await axios.get(
    url + "get-subtopic" + "/" + subject + "/" + subtopic,
    authConfig()
  );
  return response.data;
};

export const generateContent = async (subject, topic) => {
  const response = await axios.post(
    url + "ai/generate-content",
    { subject, topic },
    authConfig()
  );
  return response.data;
};

export const chatWithTutor = async (subject, topic, query) => {
  const response = await axios.post(
    url + "ai/chat",
    { subject, topic, query },
    authConfig()
  );
  return response.data;
};

export const generateQuiz = async (subject, topic, topicId) => {
  const response = await axios.post(
    url + "ai/generate-quiz",
    { subject, topic, topicId },
    authConfig()
  );
  return response.data;
};

export const submitQuiz = async (quizId, selectedOptions) => {
  const response = await axios.post(
    url + "ai/submit-quiz",
    { quizId, selectedOptions },
    authConfig()
  );
  return response.data;
};

export const resolveVideoLink = async (subject, topic) => {
  const response = await axios.post(
    url + "resolve-video",
    { subject, topic },
    authConfig()
  );
  return response.data;
};

export const getVideoLink = async (subject, topic) => {
  const response = await axios.get(
    url + "get-video-link" + "/" + subject + "/" + topic,
    authConfig()
  );
  return response.data;
};

export const addVideoLink = async (subject, topic, videoLink) => {
  try {
    const response = await axios.post(
      url + "add-video-link",
      { subject, topic, videoLink },
      authConfig()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const addBadges = async (email, badges) => {
  try {
    const response = await axios.post(
      url + "add-badges",
      { email, badges },
      authConfig()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getBadges = async (email) => {
  const response = await axios.get(
    url + "get-badges" + "/" + email,
    authConfig()
  );
  return response.data;
};

export const getTasks = async (email) => {
  const response = await axios.get(
    url + "get-tasks" + "/" + email,
    authConfig()
  );
  return response.data;
};

export const addTask = async (email, task) => {
  try {
    const response = await axios.post(
      url + "add-task",
      { email, task },
      authConfig()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateUser = async (oldEmail, newEmail, name) => {
  try {
    const response = await axios.post(
      url + "update-user",
      { oldEmail, newEmail, name },
      authConfig()
    );
    return { status: true, user: response.data };
  } catch (error) {
    return { status: false, message: error.response?.data?.message };
  }
};

export const updatePassword = async (email, oldPassword, newPassword) => {
  try {
    const response = await axios.post(
      url + "update-password",
      { email, oldPassword, newPassword },
      authConfig()
    );
    return { status: true, message: response.data.message };
  } catch (error) {
    return { status: false, message: error.response?.data?.message };
  }
};

export const addNotes = async (email, subject, notes) => {
  try {
    await axios.post(
      url + "addNotes",
      {
        email,
        subject,
        notes,
      },
      authConfig()
    );
  } catch (error) {
    console.error("Error adding notes");
  }
};

export const getNotes = async (email, subject) => {
  try {
    const response = await axios.get(
      url + "getNotes" + "/" + email + "/" + subject,
      authConfig()
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
