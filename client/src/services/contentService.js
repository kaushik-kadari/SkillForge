import axios from "axios";

const url = "http://localhost:3000/api/";

export const addContent = async (subject, subtopic, content) => {
    try {
        // console.log(subject + " " + subtopic + " " + " " + content);
        const response = await axios.post("http://localhost:3000/api/add-subtopic", { subject, subtopic, content });
        return response.data;
    } catch (error) {
        // console.error(error);
        return error;
    }
}

export const getContent = async (subject, subtopic) => {
    try {
        // console.log(url + "get-subtopic", { params: { subject, subtopic } });
        const response = await axios.get("http://localhost:3000/api/get-subtopic" + "/" + subject + "/" + subtopic);
        return response.data;
    } catch (error) {
        // console.error(error);
        return error;
    }
}

export const getVideoLink = async (subject, topic) => {
    try {
        // console.log(url + "get-subtopic", { params: { subject, topic } });
        const response = await axios.get("http://localhost:3000/api/get-video-link" + "/" + subject + "/" + topic);
        return response.data;
    } catch (error) {
        // console.error(error);
        return error;
    }
}

export const addVideoLink = async (subject, topic, videoLink) => {
    try {
        // console.log(subject + " " + subtopic + " " + " " + content);
        const response = await axios.post("http://localhost:3000/api/add-video-link", { subject, topic, videoLink });
        return response.data;
    } catch (error) {
        // console.error(error);
        return error;
    }
}

export const addBadges = async (email, badges) => {
    try {
        const response = await axios.post("http://localhost:3000/api/add-badges", { email, badges });
        return response.data;
    } catch (error) {
        // console.error(error);
        return error;
    }
}

export const getBadges = async (email) => {
    try {
        // console.log(email);
        const response = await axios.get("http://localhost:3000/api/get-badges" + "/" + email);
        return response.data;
    } catch (error) {
        // console.error(error);
        return error;
    }
}

export const getTasks = async (email) => {
    try {
        // console.log(email);
        const response = await axios.get("http://localhost:3000/api/get-tasks" + "/" + email);
        return response.data;
    } catch (error) {
        // console.error(error);
        return error;
    }
}

export const addTask = async (email, task) => {
    try {
        // console.log(email, task);
        const response = await axios.post("http://localhost:3000/api/add-task", { email, task });
        return response.data;
    } catch (error) {
        // console.error(error);
        return error;
    }
}