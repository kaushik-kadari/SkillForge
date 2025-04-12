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

export const updateUser = async (oldEmail, newEmail, name) => {
    try {
        const response = await axios.post("http://localhost:3000/api/update-user", { oldEmail, newEmail, name });
        console.log(response);
        return { status : true, user : response.data }; 
    } catch (error) {
       return { status: false, message: error.response.data.message };
    }
}

export const updatePassword = async (email, oldPassword, newPassword) => {
    try {
        const response = await axios.post("http://localhost:3000/api/update-password", { email, oldPassword, newPassword });
        console.log(response);
        return { status: true, message: response.data.message };
    } catch (error) {
        // console.log(error);
        return { status: false, message: error.response.data.message };
    }
};

export const addNotes = async (email, subject, notes) => {
    try {
        await axios.post("http://localhost:3000/api/addNotes", {
            email: email,
            subject: subject,
            notes: notes
        });
    } catch (error) {
        console.error("Error adding notes:", error);
    }
}

export const getNotes = async (email, subject) => {
    try {
        // console.log(email);
        const response = await axios.get("http://localhost:3000/api/getNotes" + "/" + email + "/" + subject);
        return response.data;
    } catch (error) {
        // console.error(error);
        return error;
    }
}