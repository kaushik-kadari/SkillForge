import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Volume2, Mic, Send, Plus, Trash2, Menu, X } from "lucide-react";
import { useAuth } from "../../services/AuthService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function InterviewBot() {
  const { user } = useAuth();
  const [topic, setTopic] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const chatContainerRef = useRef(null);
  const textAreaRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    if (user?.email) fetchInterviewHistory();
    if (window.innerWidth <= 768) {
      setIsMobile(true);
    }
  }, [user?.email]);

  const fetchInterviewHistory = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/interview?email=${user.email}`);
      setInterviewHistory(res.data);
      if (res.data.length > 0) loadPreviousInterview(res.data[0]);
    } catch (error) {
      console.error("Error fetching interview history:", error);
    }
  };

  const toggleSpeak = () => {
    if (!chatHistory.length) return;
    const lastAIMessage = chatHistory.filter((msg) => msg.role === "AI").pop()?.content;
    if (!lastAIMessage) return;

    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(lastAIMessage);
      utterance.onend = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition is not supported in your browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setAnswer(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
    };

    recognition.start();
  };

  const startInterview = async () => {
    if (!topic.trim()) {
      toast.warn("Please enter a topic!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/start-interview", {
        email: user.email,
        topic,
      });
      const newInterview = {
        sessionId: res.data.sessionId,
        topic,
        email: user.email,
        timestamp: new Date().toISOString(),
        chatHistory: [{ role: "AI", content: res.data.question }],
      };

      setSessionId(res.data.sessionId);
      setChatHistory(newInterview.chatHistory);
      setInterviewHistory([newInterview, ...interviewHistory]);
      setTopic("");

      await axios.post("http://localhost:3000/api/save-interview", newInterview);
      fetchInterviewHistory();
    } catch (error) {
      console.error("Error starting interview:", error);
      toast.error("Enter topic related to computer science only!", {
        position: "top-center",
      });
    }
    setLoading(false);
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      toast.warn("Answer cannot be empty!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/answer", { sessionId, answer });

      const updatedChatHistory = [
        ...chatHistory,
        { role: "User", content: answer },
        { role: "AI", content: res.data.followUpQuestion },
      ];

      setChatHistory(updatedChatHistory);
      setAnswer("");

      await axios.post("http://localhost:3000/api/update-interview", {
        sessionId,
        email: user.email,
        chatHistory: updatedChatHistory,
      });

      setInterviewHistory((prevHistory) =>
        prevHistory.map((intv) =>
          intv.sessionId === sessionId ? { ...intv, chatHistory: updatedChatHistory } : intv
        )
      );
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error("Failed to submit answer!");
    }
    setLoading(false);
  };

  const deleteInterview = async (sessionId) => {
    try {
      await axios.delete(`http://localhost:3000/api/delete-interview?sessionId=${sessionId}&email=${user.email}`);
      setInterviewHistory(interviewHistory.filter((interview) => interview.sessionId !== sessionId));
      fetchInterviewHistory();
      toast.success("Interview deleted successfully!");
    } catch (error) {
      console.error("Error deleting interview:", error);
      toast.error("Failed to delete interview!");
    }
  };

  const loadPreviousInterview = (interview) => {
    setSessionId(interview.sessionId);
    setChatHistory(interview.chatHistory);
    if (isMobile) setSidebarOpen(false); // Auto-close on small screens
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitAnswer();
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen relative">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Sidebar */}
      <div
        className={`fixed lg:w-64 w-64 bg-gray-900 text-white p-4 flex flex-col transition-transform transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:block z-30 h-full`}
      >
        {/* Cross icon only on small screens */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Interview History</h2>
          <button onClick={toggleSidebar} className="lg:hidden text-white">
            <X size={20} />
          </button>
        </div>

        <button onClick={() => setSessionId(null)} className="mb-4 bg-gray-500 p-2 rounded-lg flex items-center">
          <Plus size={16} className="mr-2" />
          Start New Interview
        </button>
        <div className="space-y-2 overflow-y-auto flex-1">
          {interviewHistory.map((interview, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded-lg">
              <button className="text-left flex-1" onClick={() => loadPreviousInterview(interview)}>
                {interview.topic}
              </button>
              <button onClick={() => deleteInterview(interview.sessionId)} className="text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6 lg:ml-64 relative">
        <div className="flex items-center justify-center mb-4 relative">
          <button onClick={toggleSidebar} className="lg:hidden text-gray-500 absolute left-0">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <motion.h1 className="text-2xl md:text-3xl font-bold text-center">🎤 AI Interview Simulator</motion.h1>
        </div>

        {!sessionId ? (
          <div className="max-w-xl bg-white p-6 rounded-xl shadow-lg border">
            <label className="block text-lg font-medium mb-2">Enter Topic:</label>
            <input
              type="text"
              placeholder="e.g., Java"
              className="w-full p-3 rounded-lg border"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <button onClick={startInterview} className="mt-4 w-full bg-black text-white p-3 rounded-lg">
              {loading ? "Starting..." : "Start Interview"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col flex-1 bg-white rounded-xl shadow-lg border overflow-hidden">
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-2">
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    msg.role === "AI" ? "bg-gray-300 flex justify-between" : "bg-gray-100"
                  }`}
                >
                  <strong>{msg.role}:</strong> {msg.content}
                  {msg.role === "AI" && (
                    <button onClick={toggleSpeak}>
                      <Volume2 size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Footer Input */}
            <div className="border-t p-4 bg-gray-50 flex items-center gap-2">
              <textarea
                ref={textAreaRef}
                className="flex-1 p-2 resize-none rounded-md border focus:outline-none"
                rows={2}
                placeholder="Type your answer..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button onClick={startListening}>
                <Mic size={24} />
              </button>
              <button onClick={submitAnswer}>
                <Send size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

