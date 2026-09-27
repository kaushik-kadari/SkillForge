import React, { useState, useEffect } from "react";
import { LuBadgeCheck } from "react-icons/lu";
import { LuBadgeX } from "react-icons/lu";
import { FallingLines } from "react-loader-spinner";
import { useAuth } from "../../services/AuthService";
import {
  generateQuiz,
  submitQuiz,
  getBadges,
} from "../../services/contentService";
import MarkdownContent from "../MarkdownContent/MarkdownContent";
import { X, Check, CircleX, ListChecks } from "lucide-react";

const Quiz = ({ subject, topic, id }) => {
  const top = topic.toUpperCase();
  const [quizId, setQuizId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizOver, setQuizOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [loadError, setLoadError] = useState("");
  const { user, setBadges } = useAuth();

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
        setLoadError("");
        const response = await generateQuiz(subject, topic, id);
        setQuizId(response.quizId);
        setQuestions(response.questions || []);
        setFetched(true);
      } catch (error) {
        const status = error?.response?.status;
        setLoadError(
          status === 429
            ? "AI rate limit reached. Please wait and try again."
            : "Failed to load quiz questions. Please try again."
        );
        setFetched(false);
        setStarted(false);
      }
    };

    if (started && !fetched) {
      fetchQuestions();
    }
  }, [subject, topic, id, started, fetched]);

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

  const handleNextQuestion = async () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      return;
    }

    if (!quizId || submitting) return;
    setSubmitting(true);
    try {
      const result = await submitQuiz(quizId, selectedOptions);
      setScore(result.score);
      setQuestions(result.questions || questions);
      setQuizOver(true);

      if (result.awarded && user?.email && setBadges) {
        try {
          const badgesRes = await getBadges(user.email);
          if (badgesRes?.badges) setBadges(badgesRes.badges);
        } catch {
          /* ignore badge refresh errors */
        }
      }
    } catch (error) {
      setLoadError(
        error?.response?.data?.error ||
          "Failed to submit quiz. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleStart = () => {
    setStarted(true);
    setLoadError("");
  };

  const resetQuiz = () => {
    setStarted(false);
    setQuizOver(false);
    setCurrentQuestion(0);
    setSelectedOptions({});
    setScore(0);
    setShowReview(false);
    setFetched(false);
    setQuizId(null);
    setQuestions([]);
    setLoadError("");
  };

  if (loadError && !quizOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] px-4 text-center gap-4">
        <p className="text-base text-gray-700 font-medium">{loadError}</p>
        <button
          type="button"
          className="bg-black text-sm text-white font-bold py-2 px-4 rounded"
          onClick={resetQuiz}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (quizOver) {
    return (
      <div className="flex flex-col">
        <h2 className="text-4xl font-bold text-center">{top}</h2>
        <div className="min-h-[50vh] flex flex-col items-center justify-center px-4">
          {score === questions.length ? (
            <LuBadgeCheck size={150} />
          ) : (
            <LuBadgeX size={150} />
          )}
          <p className="text-4xl mt-8 text-center">
            {score === questions.length ? "Congratulations!! " : ""}
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
                          {isCorrect ? (
                            <Check size={14} />
                          ) : (
                            <CircleX size={14} />
                          )}
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
                                    isCorrect
                                      ? "text-emerald-800"
                                      : "text-red-700"
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

  if ((questions.length === 0 && started) || submitting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-h-[60vh]">
        <FallingLines
          color="black"
          width="150"
          visible={true}
          ariaLabel="falling-circles-loading"
        />
        <p className="text-base text-gray-500 font-light my-4">
          {submitting ? "Submitting Quiz..." : "Loading Quiz..."}
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
        {started && questions[currentQuestion] && (
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
                  disabled={
                    selectedOptions[currentQuestion] === undefined ||
                    submitting
                  }
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
