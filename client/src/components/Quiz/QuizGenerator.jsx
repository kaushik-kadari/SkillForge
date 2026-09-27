import React, { useState, useEffect } from "react";
import Groq from "groq-sdk";
import { LuBadgeCheck } from "react-icons/lu";
import { LuBadgeX } from "react-icons/lu";
import { FallingLines } from "react-loader-spinner";
import { useAuth } from "../../services/AuthService";
import { getTasks, addTask } from "../../services/contentService";
import MarkdownContent from "../MarkdownContent/MarkdownContent";
import { X, Check, CircleX, ListChecks } from "lucide-react";

const Quiz = ({ subject, topic, id }) => {
  const top = topic.toUpperCase();
  const [questions, setQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizOver, setQuizOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const { addBadge, user } = useAuth();

  const apiKey = import.meta.env.VITE_groqApiKey;
  const groq = new Groq({ apiKey: apiKey, dangerouslyAllowBrowser: true });

  useEffect(() => {
    if (!showReview) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showReview]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
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
          model: "qwen/qwen3.8-27b",
          max_tokens: 900,
          temperature: 0.4,
        });
        const responseString = response.choices[0].message.content;
        const cleanedString = responseString.replace(/\\[\\n]/g, "");
        const quizArray = JSON.parse(cleanedString);
        setQuestions(quizArray);
        setFetched(true);
      } catch (error) {
        console.error("Failed to fetch quiz questions", error);
        if (!fetched) fetchQuestions();
      }
    };

    if (started && !fetched) {
      fetchQuestions();
    }
  }, [subject, topic, started]);

  const handleAnswer = (option) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [currentQuestion]: option,
    }));
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleBadges = async () => {
    try {
      if (!user.email) return;
      const Task = subject + "-" + topic;
      const res = await getTasks(user.email);
      const done = !res.tasks ? false : res.tasks.includes(Task);
      if (done) return;
      await addTask(user.email, Task);
    } catch (error) {
      console.error(error);
      return;
    }

    id = Number.parseInt(id);
    if (id >= 6 && id <= 17) {
      addBadge(id);
    } else if (id >= 18 && id <= 23) {
      addBadge(id);
    } else if (id >= 24 && id <= 29) {
      addBadge(id);
    } else if (id === 4) {
      addBadge(4);
    } else if (id === 5) {
      addBadge(5);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizOver(true);
      let nextScore = 0;
      Object.keys(selectedOptions).forEach((index) => {
        if (selectedOptions[index] === questions[index].correctAnswer) {
          nextScore++;
        }
      });
      setScore(nextScore);
      if (nextScore == 5) handleBadges();
    }
  };

  const handleStart = () => {
    setStarted(true);
  };

  const resetQuiz = () => {
    setStarted(false);
    setQuizOver(false);
    setCurrentQuestion(0);
    setSelectedOptions({});
    setScore(0);
    setShowReview(false);
  };

  if (quizOver) {
    return (
      <div className="flex flex-col">
        <h2 className="text-4xl font-bold text-center">{top}</h2>
        <div className="min-h-[50vh] flex flex-col items-center justify-center px-4">
          {score === 5 ? <LuBadgeCheck size={150} /> : <LuBadgeX size={150} />}
          <p className="text-4xl mt-8 text-center">
            {score === 5 ? "Congratulations!! " : ""}
            You scored {score} out of {questions.length}!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-black font-bold px-4 py-3 rounded-md hover:text-white transition-all border-solid border-black border-2 text-sm hover:bg-black"
              onClick={() => setShowReview(true)}
            >
              <ListChecks size={18} />
              Review Answers
            </button>
            <button
              type="button"
              className="text-black font-bold px-4 py-3 rounded-md hover:text-white transition-all border-solid border-black border-2 text-sm hover:bg-black"
              onClick={resetQuiz}
            >
              Take Quiz Again
            </button>
          </div>
        </div>

        {showReview && (
          <div
            className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setShowReview(false)}
            role="presentation"
          >
            <div
              className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-black/10 bg-[#f7f5ef] shadow-[0_16px_48px_-12px_rgba(0,0,0,0.35)] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="quiz-review-title"
            >
              <div className="shrink-0 flex items-center justify-between gap-3 px-5 py-4 border-b border-black/10">
                <div className="min-w-0">
                  <h3
                    id="quiz-review-title"
                    className="text-lg font-bold text-black tracking-tight"
                  >
                    Answer overview
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {score} correct · {questions.length - score} incorrect
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowReview(false)}
                  className="p-1.5 rounded-lg text-gray-600 hover:bg-black/5 transition-colors"
                  aria-label="Close review"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-3">
                {questions.map((q, index) => {
                  const userAnswer = selectedOptions[index];
                  const isCorrect = userAnswer === q.correctAnswer;
                  const unanswered = userAnswer === undefined;

                  return (
                    <div
                      key={index}
                      className={`rounded-xl border p-4 ${
                        isCorrect
                          ? "border-emerald-200 bg-emerald-50/70"
                          : "border-red-200 bg-red-50/60"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className={`mt-0.5 shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full ${
                            isCorrect
                              ? "bg-emerald-600 text-white"
                              : "bg-red-600 text-white"
                          }`}
                        >
                          {isCorrect ? <Check size={14} /> : <CircleX size={14} />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-2 text-sm font-semibold text-black">
                            <span className="shrink-0">{index + 1}.</span>
                            <div className="min-w-0 flex-1 [&_.markdown-body]:text-sm">
                              <MarkdownContent compact className="!m-0">
                                {q.question}
                              </MarkdownContent>
                            </div>
                          </div>

                          <div className="mt-3 space-y-1.5 text-sm">
                            <p className="m-0 text-gray-700">
                              <span className="font-semibold text-gray-800">
                                Your answer:{" "}
                              </span>
                              {unanswered ? (
                                <span className="italic text-gray-500">
                                  Not answered
                                </span>
                              ) : (
                                <span
                                  className={
                                    isCorrect ? "text-emerald-800" : "text-red-700"
                                  }
                                >
                                  {userAnswer}
                                </span>
                              )}
                            </p>
                            {!isCorrect && (
                              <p className="m-0 text-gray-700">
                                <span className="font-semibold text-gray-800">
                                  Correct answer:{" "}
                                </span>
                                <span className="text-emerald-800">
                                  {q.correctAnswer}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="shrink-0 flex justify-end px-5 py-3 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setShowReview(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-black text-white hover:bg-[#2b2b2b] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (questions.length === 0 && started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-h-[60vh]">
        <FallingLines
          color="black"
          width="150"
          visible={true}
          ariaLabel="falling-circles-loading"
        />
        <p className="text-base text-gray-500 font-light my-4">
          Loading Quiz...
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-center">{top}</h2>
      <div className="mt-4 p-4">
        {!started && (
          <div className="flex justify-center">
            <button
              className="bg-black text-sm hover:bg-[#676767] text-white font-bold py-2 px-4 rounded transition-all"
              onClick={handleStart}
            >
              Start Quiz
            </button>
          </div>
        )}
        {started && (
          <div>
            <div className="flex items-start gap-2 text-xl mb-4 font-semibold">
              <span className="shrink-0 pt-0.5">{currentQuestion + 1}.</span>
              <MarkdownContent compact className="min-w-0 flex-1 !m-0">
                {questions[currentQuestion].question}
              </MarkdownContent>
            </div>
            <div>
              {questions[currentQuestion].options.map((option, index) => (
                <div className="flex items-start text-lg" key={index}>
                  <label
                    htmlFor={`${currentQuestion}-${index}`}
                    className="cursor-pointer flex items-start"
                  >
                    <input
                      id={`${currentQuestion}-${index}`}
                      type="radio"
                      name="answer"
                      onChange={() => handleAnswer(option)}
                      className="mr-2 mt-1.5 focus:ring-0 "
                      style={{
                        backgroundColor:
                          selectedOptions[currentQuestion] === option
                            ? "black"
                            : "",
                      }}
                      checked={selectedOptions[currentQuestion] === option}
                    />
                    <span className="ml-2">
                      <MarkdownContent compact>{option}</MarkdownContent>
                    </span>
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <button
                className={`bg-black text-sm hover:bg-[#676767] text-white font-bold py-2 px-4 rounded ${
                  currentQuestion === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handlePreviousQuestion}
              >
                Previous
              </button>

              {currentQuestion + 1 < questions.length && (
                <button
                  className={`bg-black text-sm hover:bg-[#676767] text-white font-bold py-2 px-4 rounded ${
                    selectedOptions[currentQuestion] === undefined
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={handleNextQuestion}
                  disabled={selectedOptions[currentQuestion] === undefined}
                >
                  Save & Next <i className="fas fa-arrow-right ml-2"></i>
                </button>
              )}

              {currentQuestion + 1 === questions.length && (
                <button
                  className={`bg-black text-sm hover:bg-[#676767] text-white font-bold py-2 px-4 rounded ${
                    selectedOptions[currentQuestion] === undefined
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={handleNextQuestion}
                  disabled={selectedOptions[currentQuestion] === undefined}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
