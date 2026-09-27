import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Volume2,
  Mic,
  ArrowUp,
  Plus,
  Trash2,
  Menu,
  X,
  Bot,
  MessageSquare,
  Sparkles,
  Loader2,
  Square,
} from "lucide-react";
import { useAuth } from "../../services/AuthService";
import { toast } from "react-toastify";
import MarkdownContent from "../MarkdownContent/MarkdownContent";

const suggestedTopics = [
  "JavaScript",
  "React",
  "Data Structures",
  "DBMS",
  "Operating Systems",
  "System Design",
];

const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const displayTopic = (topic = "") => topic.replace(/\s-\s\d{4}-\d{2}-\d{2}$/, "");

const pickMimeType = () => {
  const types = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"];
  return types.find((t) => window.MediaRecorder?.isTypeSupported?.(t)) || "";
};

const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result || "";
      const base64 = String(result).split(",")[1] || "";
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

export default function InterviewBot() {
  const { user } = useAuth();
  const [topic, setTopic] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [sessionTopic, setSessionTopic] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [answer, setAnswer] = useState("");
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ending, setEnding] = useState(false);
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [sessionStatus, setSessionStatus] = useState("active");
  const [feedback, setFeedback] = useState("");
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const chatContainerRef = useRef(null);
  const textAreaRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);

  const url = import.meta.env.VITE_serverUrl;
  const busy = starting || submitting || ending;

  const authConfig = () => {
    const token = localStorage.getItem("token");
    return { headers: token ? { Authorization: `Bearer ${token}` } : {} };
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, submitting, feedback]);

  useEffect(() => {
    if (user?.email) fetchInterviewHistory();
  }, [user?.email]);

  useEffect(() => {
    return () => {
      stopMediaTracks();
      synthRef.current?.cancel();
    };
  }, []);

  const stopMediaTracks = () => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
  };

  const fetchInterviewHistory = async () => {
    try {
      const res = await axios.get(
        url + "interview?email=" + encodeURIComponent(user.email),
        authConfig()
      );
      setInterviewHistory(res.data || []);
    } catch (error) {
      console.error("Error fetching interview history");
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

  const transcribeAudio = async (blob) => {
    if (!blob || blob.size < 1000) {
      toast.warn("Recording too short. Speak a bit longer, then stop.");
      return;
    }

    setIsTranscribing(true);
    try {
      const audioBase64 = await blobToBase64(blob);
      const res = await axios.post(
        url + "transcribe",
        {
          audioBase64,
          mimeType: blob.type || "audio/webm",
        },
        authConfig()
      );
      const text = (res.data?.text || "").trim();
      if (text) {
        setAnswer((prev) => (prev ? `${prev.trim()} ${text}` : text));
      } else {
        toast.warn("Couldn't catch that. Try speaking again.");
      }
    } catch (error) {
      console.error("Transcription error");
      toast.error(error.response?.data?.error || "Failed to transcribe audio.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const stopListening = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      try {
        recorder.stop();
      } catch {
        stopMediaTracks();
        setIsListening(false);
      }
    } else {
      stopMediaTracks();
      setIsListening(false);
    }
  };

  const startListening = async () => {
    if (isTranscribing || sessionStatus === "ended") return;

    if (isListening) {
      stopListening();
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      toast.warn("Voice recording is not supported in this browser.");
      return;
    }

    if (isSpeaking || synthRef.current?.speaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      audioChunksRef.current = [];

      const mimeType = pickMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      recorder.onstop = async () => {
        const chunks = [...audioChunksRef.current];
        const type = recorder.mimeType || mimeType || "audio/webm";
        const blob = new Blob(chunks, { type });
        stopMediaTracks();
        setIsListening(false);
        await transcribeAudio(blob);
      };

      recorder.onerror = () => {
        stopMediaTracks();
        setIsListening(false);
        toast.error("Recording failed. Please try again.");
      };

      recorder.start();
      setIsListening(true);
    } catch (error) {
      console.error("Mic access error:", error);
      stopMediaTracks();
      setIsListening(false);
      if (error?.name === "NotAllowedError" || error?.name === "PermissionDeniedError") {
        toast.error("Microphone permission denied. Allow mic access and try again.");
      } else if (error?.name === "NotFoundError") {
        toast.error("No microphone found. Check your audio device.");
      } else {
        toast.error("Could not start voice input. Please try again.");
      }
    }
  };

  const startInterview = async () => {
    if (!topic.trim()) {
      toast.warn("Please enter a topic!");
      return;
    }
    if (!user?.email) {
      toast.error("You must be logged in to start an interview.");
      return;
    }

    setStarting(true);
    try {
      const res = await axios.post(
        url + "start-interview",
        {
          email: user.email,
          topic: topic.trim(),
        },
        authConfig()
      );

      const cleanTopic = res.data.topic || topic.trim();
      const history = res.data.chatHistory || [
        { role: "AI", content: res.data.question },
      ];

      setSessionId(res.data.sessionId);
      setSessionTopic(cleanTopic);
      setChatHistory(history);
      setSessionStatus("active");
      setFeedback("");
      setTopic("");
      setAnswer("");

      setInterviewHistory((prev) => [
        {
          sessionId: res.data.sessionId,
          topic: cleanTopic,
          email: user.email,
          chatHistory: history,
          status: "active",
          createdAt: new Date().toISOString(),
        },
        ...prev.filter((i) => i.sessionId !== res.data.sessionId),
      ]);
    } catch (error) {
      console.error("Error starting interview");
      toast.error(
        error.response?.data?.error || "Failed to start interview. Please try again."
      );
    } finally {
      setStarting(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      toast.warn("Answer cannot be empty!");
      return;
    }
    if (!sessionId) return;
    if (sessionStatus === "ended") {
      toast.warn("This interview has ended. Start a new one to continue.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(
        url + "answer",
        {
          sessionId,
          answer: answer.trim(),
          email: user.email,
        },
        authConfig()
      );

      const updatedHistory =
        res.data.chatHistory ||
        [
          ...chatHistory,
          { role: "User", content: answer.trim() },
          { role: "AI", content: res.data.followUpQuestion },
        ];

      setChatHistory(updatedHistory);
      setAnswer("");
      if (res.data.status) setSessionStatus(res.data.status);

      setInterviewHistory((prev) =>
        prev.map((intv) =>
          intv.sessionId === sessionId
            ? { ...intv, chatHistory: updatedHistory, status: res.data.status || intv.status }
            : intv
        )
      );
    } catch (error) {
      console.error("Error submitting answer");
      toast.error(error.response?.data?.error || "Failed to submit answer!");
    } finally {
      setSubmitting(false);
    }
  };

  const endInterview = async () => {
    if (!sessionId || ending) return;

    setEnding(true);
    try {
      const res = await axios.post(
        url + "end-interview",
        {
          sessionId,
          email: user.email,
        },
        authConfig()
      );

      setSessionStatus("ended");
      setFeedback(res.data.feedback || "Interview ended.");
      if (res.data.chatHistory) setChatHistory(res.data.chatHistory);

      setInterviewHistory((prev) =>
        prev.map((intv) =>
          intv.sessionId === sessionId
            ? {
                ...intv,
                status: "ended",
                feedback: res.data.feedback || "",
                chatHistory: res.data.chatHistory || intv.chatHistory,
              }
            : intv
        )
      );
      toast.success("Interview ended. Feedback is ready.");
      setConfirmDialog(null);
    } catch (error) {
      console.error("Error ending interview");
      toast.error(error.response?.data?.error || "Failed to end interview.");
    } finally {
      setEnding(false);
    }
  };

  const deleteInterview = async (id) => {
    if (!id || deleting) return;

    setDeleting(true);
    try {
      await axios.delete(
        url +
          "delete-interview?sessionId=" +
          encodeURIComponent(id) +
          "&email=" +
          encodeURIComponent(user.email),
        authConfig()
      );
      setInterviewHistory((prev) => prev.filter((interview) => interview.sessionId !== id));
      if (sessionId === id) {
        startNewInterview();
      }
      toast.success("Interview deleted successfully!");
      setConfirmDialog(null);
    } catch (error) {
      console.error("Error deleting interview");
      toast.error(error.response?.data?.error || "Failed to delete interview!");
    } finally {
      setDeleting(false);
    }
  };

  const requestEndInterview = () => {
    if (!sessionId || ending || submitting) return;
    setConfirmDialog({
      type: "end",
      title: "End this interview?",
      message:
        "You'll get feedback on your answers. You won't be able to continue this session afterward.",
      confirmLabel: "End interview",
      tone: "default",
    });
  };

  const requestDeleteInterview = (id, topicLabel) => {
    setConfirmDialog({
      type: "delete",
      sessionId: id,
      title: "Delete this interview?",
      message: topicLabel
        ? `"${topicLabel}" will be permanently removed from your history.`
        : "This interview will be permanently removed from your history.",
      confirmLabel: "Delete",
      tone: "danger",
    });
  };

  const handleConfirmDialog = () => {
    if (!confirmDialog) return;
    if (confirmDialog.type === "end") {
      endInterview();
    } else if (confirmDialog.type === "delete") {
      deleteInterview(confirmDialog.sessionId);
    }
  };

  const closeConfirmDialog = () => {
    if (ending || deleting) return;
    setConfirmDialog(null);
  };

  const loadPreviousInterview = (interview) => {
    setSessionId(interview.sessionId);
    setSessionTopic(displayTopic(interview.topic));
    setChatHistory(interview.chatHistory || []);
    setSessionStatus(interview.status === "ended" ? "ended" : "active");
    setFeedback(interview.feedback || "");
    setAnswer("");
    setSidebarOpen(false);
  };

  const startNewInterview = () => {
    setSessionId(null);
    setSessionTopic("");
    setChatHistory([]);
    setTopic("");
    setAnswer("");
    setSessionStatus("active");
    setFeedback("");
    setSidebarOpen(false);
    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!busy && sessionStatus !== "ended") submitAnswer();
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const activeTopic =
    sessionTopic || displayTopic(interviewHistory.find((i) => i.sessionId === sessionId)?.topic);
  const questionCount = chatHistory.filter((msg) => msg.role === "AI").length;
  const lastAIIndex = chatHistory.map((msg) => msg.role).lastIndexOf("AI");
  const isEnded = sessionStatus === "ended";

  return (
    <div className="flex h-[calc(100dvh-max(80px,10vh))] relative bg-[#f7f5ef] overflow-hidden p-0 lg:p-4 gap-4">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed lg:static top-[max(80px,10vh)] lg:top-auto left-0 z-30 h-[calc(100dvh-max(80px,10vh))] lg:h-full w-72 shrink-0 bg-white/80 lg:bg-white/70 backdrop-blur-md border-r lg:border border-black/[0.06] lg:rounded-2xl lg:shadow-[0_4px_24px_-8px_rgba(0,0,0,0.12)] flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex justify-between items-center px-5 pt-5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
              <Bot size={17} />
            </div>
            <span className="font-bold text-black tracking-tight">Interview Bot</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1.5 rounded-lg hover:bg-black/5 text-gray-600"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-4">
          <button
            onClick={startNewInterview}
            className="w-full bg-black text-white py-2.5 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm hover:bg-[#2b2b2b] active:scale-[0.98] transition-all shadow-sm"
          >
            <Plus size={16} />
            New Interview
          </button>
        </div>

        <p className="px-5 pt-6 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Recent
        </p>

        <div className="overflow-y-auto flex-1 min-h-0 px-3 pb-4 space-y-0.5">
          {interviewHistory.length === 0 ? (
            <div className="mx-2 mt-2 rounded-xl border border-dashed border-black/10 p-4 text-center">
              <MessageSquare size={20} className="mx-auto text-gray-300" />
              <p className="text-xs text-gray-500 mt-2">Your interviews will show up here.</p>
            </div>
          ) : (
            interviewHistory.map((interview) => {
              const isActive = sessionId === interview.sessionId;
              const ended = interview.status === "ended";
              return (
                <div
                  key={interview.sessionId}
                  className={`group relative flex items-center rounded-xl transition-colors ${
                    isActive ? "bg-[#ebe7de]" : "hover:bg-black/[0.04]"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-black" />
                  )}
                  <button
                    className="flex-1 min-w-0 text-left pl-4 pr-2 py-2.5"
                    onClick={() => loadPreviousInterview(interview)}
                  >
                    <p
                      className={`text-sm truncate ${
                        isActive ? "font-semibold text-black" : "font-medium text-gray-700"
                      }`}
                    >
                      {displayTopic(interview.topic)}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {ended ? "Ended" : "Active"}
                      {formatDate(interview.createdAt || interview.timestamp)
                        ? ` · ${formatDate(interview.createdAt || interview.timestamp)}`
                        : ""}
                    </p>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      requestDeleteInterview(
                        interview.sessionId,
                        displayTopic(interview.topic)
                      );
                    }}
                    className="mr-2 p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100 transition-all"
                    aria-label={`Delete ${displayTopic(interview.topic)}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-white/60 lg:rounded-2xl lg:border border-black/[0.06] lg:shadow-[0_4px_24px_-8px_rgba(0,0,0,0.12)] overflow-hidden">
        <header className="shrink-0 h-14 px-4 md:px-6 flex items-center gap-3 border-b border-black/[0.06] bg-white/70 backdrop-blur-md">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 -ml-2 rounded-lg text-gray-700 hover:bg-black/5 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
          {sessionId ? (
            <>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-black truncate">
                  {activeTopic || "Interview"}
                </p>
                <p className="text-[11px] text-gray-500">
                  {isEnded ? "Ended" : "In progress"} · {questionCount}{" "}
                  {questionCount === 1 ? "question" : "questions"}
                </p>
              </div>
              {!isEnded && (
                <button
                  onClick={requestEndInterview}
                  disabled={ending || submitting}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-black/15 bg-white hover:bg-black/5 disabled:opacity-50 transition-colors"
                >
                  {ending ? <Loader2 size={14} className="animate-spin" /> : <Square size={12} />}
                  End
                </button>
              )}
            </>
          ) : (
            <p className="text-sm font-semibold text-black">New interview</p>
          )}
        </header>

        {!sessionId ? (
          <div className="flex-1 overflow-y-auto flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full max-w-2xl text-center"
            >
              <div className="mx-auto w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center shadow-lg shadow-black/20">
                <Sparkles size={24} />
              </div>
              <h1 className="mt-6 text-3xl md:text-4xl font-bold tracking-tight text-black">
                Ready for your interview?
              </h1>
              <p className="mt-3 text-gray-500 text-sm md:text-base">
                Pick a computer science topic and the AI interviewer will ask you questions one at a
                time.
              </p>

              <div className="mt-8 flex items-center gap-2 p-1.5 pl-5 rounded-2xl bg-[#f5f2e9] shadow-sm">
                <input
                  type="text"
                  placeholder="Enter a topic, e.g. Java"
                  className="flex-1 min-w-0 bg-transparent !border-0 !outline-none !ring-0 !shadow-none py-2.5 text-sm md:text-base focus:!outline-none focus:!ring-0 focus:!border-0 focus:!shadow-none placeholder:text-gray-400"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !starting) startInterview();
                  }}
                />
                <button
                  onClick={startInterview}
                  disabled={starting}
                  className="shrink-0 inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#2b2b2b] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {starting ? <Loader2 size={16} className="animate-spin" /> : null}
                  {starting ? "Checking…" : "Start"}
                </button>
              </div>

              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {suggestedTopics.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTopic(t)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      topic === t
                        ? "bg-black text-white border-black"
                        : "bg-white/70 text-gray-700 border-black/10 hover:border-black/30 hover:bg-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <>
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto min-h-0">
              <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-6">
                <AnimatePresence initial={false}>
                  {chatHistory.map((msg, index) => {
                    const isAI = msg.role === "AI";
                    return (
                      <motion.div
                        key={`${msg.role}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className={`flex gap-3 ${isAI ? "justify-start" : "justify-end"}`}
                      >
                        {isAI && (
                          <div className="shrink-0 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center mt-0.5">
                            <Bot size={16} />
                          </div>
                        )}
                        <div
                          className={`group max-w-[85%] md:max-w-[78%] ${
                            isAI ? "" : "flex flex-col items-end"
                          }`}
                        >
                          <div
                            className={`px-4 py-3 text-sm md:text-[15px] leading-relaxed break-words ${
                              isAI
                                ? "bg-white border border-black/[0.06] text-gray-900 rounded-2xl rounded-tl-md shadow-[0_1px_8px_-4px_rgba(0,0,0,0.12)]"
                                : "bg-black text-white rounded-2xl rounded-tr-md"
                            }`}
                          >
                            {isAI ? (
                              <MarkdownContent compact>
                                {msg.content}
                              </MarkdownContent>
                            ) : (
                              <p className="whitespace-pre-wrap m-0">{msg.content}</p>
                            )}
                          </div>
                          {isAI && index === lastAIIndex && !isEnded && (
                            <button
                              onClick={toggleSpeak}
                              className={`mt-1.5 inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg transition-colors ${
                                isSpeaking
                                  ? "bg-black text-white"
                                  : "text-gray-500 hover:text-black hover:bg-black/5"
                              }`}
                              aria-label={isSpeaking ? "Stop speaking" : "Read aloud"}
                            >
                              <Volume2 size={14} />
                              {isSpeaking ? "Stop" : "Listen"}
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {submitting && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="shrink-0 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                      <Bot size={16} />
                    </div>
                    <div className="bg-white border border-black/[0.06] rounded-2xl rounded-tl-md px-4 py-3.5 flex items-center gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-gray-400"
                          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {isEnded && feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-black/10 bg-[#f5f2e9] p-5 md:p-6"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                      Interview feedback
                    </p>
                    <div className="text-sm md:text-[15px]">
                      <MarkdownContent>{feedback}</MarkdownContent>
                    </div>
                    <button
                      onClick={startNewInterview}
                      className="mt-5 inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#2b2b2b] transition-colors"
                    >
                      <Plus size={16} />
                      Start another interview
                    </button>
                  </motion.div>
                )}
              </div>
            </div>

            {!isEnded && (
              <div className="shrink-0 px-4 md:px-6 pb-4 pt-2">
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-end gap-2 p-2 pl-4 rounded-2xl bg-[#f5f2e9] shadow-sm">
                    <textarea
                      ref={textAreaRef}
                      className="flex-1 min-w-0 py-2 resize-none bg-transparent !border-0 !outline-none !ring-0 !shadow-none focus:!outline-none focus:!ring-0 focus:!border-0 focus:!shadow-none text-sm md:text-[15px] placeholder:text-gray-400 max-h-40 disabled:opacity-60"
                      rows={1}
                      placeholder={
                        isTranscribing
                          ? "Transcribing…"
                          : isListening
                            ? "Listening… click mic to stop"
                            : "Type your answer..."
                      }
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={submitting || isTranscribing}
                    />
                    <button
                      onClick={startListening}
                      disabled={submitting || isTranscribing}
                      className={`relative shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                        isListening
                          ? "bg-red-50 text-red-600"
                          : isTranscribing
                            ? "bg-black/5 text-gray-500"
                            : "text-gray-500 hover:text-black hover:bg-black/5"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      aria-label={
                        isTranscribing
                          ? "Transcribing"
                          : isListening
                            ? "Stop listening"
                            : "Voice input"
                      }
                      title={
                        isTranscribing
                          ? "Transcribing…"
                          : isListening
                            ? "Stop listening"
                            : "Voice input"
                      }
                    >
                      {isListening && (
                        <span className="absolute inset-0 rounded-xl border-2 border-red-400 animate-ping opacity-60" />
                      )}
                      {isTranscribing ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Mic size={18} />
                      )}
                    </button>
                    <button
                      onClick={submitAnswer}
                      disabled={submitting || !answer.trim()}
                      className="shrink-0 w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center hover:bg-[#2b2b2b] active:scale-95 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                      aria-label="Send answer"
                    >
                      {submitting ? (
                        <Loader2 size={17} className="animate-spin" />
                      ) : (
                        <ArrowUp size={18} />
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-center text-[11px] text-gray-400">
                    Press Enter to send, Shift + Enter for a new line
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <AnimatePresence>
        {confirmDialog && (
          <motion.div
            key="confirm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]"
            onClick={closeConfirmDialog}
            role="presentation"
          >
            <motion.div
              key="confirm-dialog"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-sm rounded-2xl border border-black/10 bg-[#f7f5ef] shadow-[0_16px_48px_-12px_rgba(0,0,0,0.35)] p-5"
              onClick={(e) => e.stopPropagation()}
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="interview-confirm-title"
              aria-describedby="interview-confirm-desc"
            >
              <h2
                id="interview-confirm-title"
                className="text-lg font-bold text-black tracking-tight"
              >
                {confirmDialog.title}
              </h2>
              <p
                id="interview-confirm-desc"
                className="mt-2 text-sm text-gray-600 leading-relaxed"
              >
                {confirmDialog.message}
              </p>
              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeConfirmDialog}
                  disabled={ending || deleting}
                  className="px-3.5 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-black/5 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDialog}
                  disabled={ending || deleting}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-colors ${
                    confirmDialog.tone === "danger"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-black hover:bg-[#2b2b2b]"
                  }`}
                >
                  {(ending || deleting) && (
                    <Loader2 size={14} className="animate-spin" />
                  )}
                  {confirmDialog.confirmLabel}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
