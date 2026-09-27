import { useState, useEffect, useRef } from "react";
import "./ChatAi.css";
import MarkdownContent from "../MarkdownContent/MarkdownContent";
import { RiRobot3Line } from "react-icons/ri";
import { chatWithTutor } from "../../services/contentService";

const ChatAi = ({ subject, topic }) => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleQuerySubmit(e);
    }
  };

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);

    const userQuery = query;
    setMessages((prev) => [...prev, { role: "user", content: userQuery }]);
    setQuery("");

    try {
      const res = await chatWithTutor(subject, topic, userQuery);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: res.content },
      ]);
    } catch (error) {
      const msg =
        error?.response?.status === 429
          ? "AI is busy right now. Please wait a moment and try again."
          : "Something went wrong. Please try again.";
      setMessages((prev) => [...prev, { role: "ai", content: msg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-ai-container">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Interact with our AI Assistant
      </h2>

      <div className="chat-window" ref={chatWindowRef}>
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="loading-text text-xl">
              Start by asking a question related to the content...
            </p>
          </div>
        )}
        {messages.map((message, index) => (
          <div className="flex" key={`${message.role}-${index}`}>
            <p>
              {message.role === "ai" && (
                <RiRobot3Line className="text-2xl mr-2" />
              )}
            </p>
            <div
              className={`chat-message ${
                message.role === "user" ? "user-message" : "ai-message"
              }`}
            >
              <MarkdownContent compact>{message.content}</MarkdownContent>
            </div>
          </div>
        ))}
        {loading && <p className="loading-text">AI is thinking...</p>}
      </div>

      <form onSubmit={handleQuerySubmit} className="chat-form">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask any question related to the content..."
          rows="3"
          className="chat-input outline-none"
          required
        />
        <button
          type="submit"
          className="chat-submit-btn font-semibold hover:bg-[#676767]"
          disabled={loading}
        >
          {loading ? "Loading..." : "Ask AI"}
        </button>
      </form>
    </div>
  );
};

export default ChatAi;
