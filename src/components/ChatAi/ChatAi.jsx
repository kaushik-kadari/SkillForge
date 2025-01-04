import { useState, useEffect, useRef } from "react";
import Groq from "groq-sdk";
import "./ChatAi.css"; // Chatbot-specific styling
import ReactMarkdown from "react-markdown";

const ChatAi = ({ subject, topic }) => {
  const apiKey = "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";
  const groq = new Groq({ apiKey: apiKey, dangerouslyAllowBrowser: true });

  const [query, setQuery] = useState(""); // User's query
  const [messages, setMessages] = useState([]); // Messages array to store user and AI messages
  const [loading, setLoading] = useState(false); // Loading state

  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  // handle Key Down (Enter) event
  const handleKeyDown = (e) => {
    // e.preventDefault();
    if (e.key === "Enter" && !e.shiftKey) {
      handleQuerySubmit(e);
    }
  }

  // Function to handle submitting the query
  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (!query) return; // If query is empty, do nothing
    setLoading(true); // Show loading state

    // Add the user's query to the message list
    setMessages((prev) => [...prev, { role: "user", content: query }]);
    setQuery(""); // Clear the input

    try {
      // Send the user's query to the Groq API
      const res = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Imagine you are a professional ${subject} Assistant. 
            Dont say anything about the query which is out of context.
            You have explained the concept of ${topic}. A student has asked a question related to this: '${query}'. 
            Provide a clear and short answer for this question in max of 100 words, ensuring it remains relevant to the ${topic} and ${subject} being discussed.
            Do not add any additional context or explanation, and don’t answer the query if it's not related to the ${topic} and ${subject} being discussed.`,
          },
        ],
        model: "llama3-8b-8192", // Model used for generating responses
      });

      // Add the AI's response to the message list
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: res.choices[0].message.content },
      ]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <div className="chat-ai-container">
      <h2 className="text-2xl font-bold text-center mb-2">Ask AI About Your Content</h2>

      {/* Chat window displaying all messages */}
      <div className="chat-window" ref={chatWindowRef}>
        {
          messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <p className="loading-text text-xl">
                Start by asking a question related to the content...
              </p>
            </div>
          )
        }
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${
              message.role === "user" ? "user-message" : "ai-message"
            }`}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        ))}
        {loading && <p className="loading-text">AI is thinking...</p>}
      </div>

      {/* Form to enter the user's query */}
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
        <button type="submit" className="chat-submit-btn" disabled={loading}>
          {loading ? "Loading..." : "Ask AI"}
        </button>
      </form>
    </div>
  );
};

export default ChatAi;
