import React, { useState, useEffect } from "react";
import axios from "axios";
import Groq from "groq-sdk";
import { LuBadgeCheck } from "react-icons/lu";
import { LuBadgeX } from "react-icons/lu";
import { FallingLines } from "react-loader-spinner";
import { useAuth } from "../../services/AuthService";
import { getTasks, addTask } from "../../services/contentService";


const Quiz = ({ subject, topic, id }) => {
  const sub = subject.toUpperCase();
  const top = topic.toUpperCase();
  const [questions, setQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizOver, setQuizOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [fetched, setFetched] = useState(false);
  const { addBadge, user } = useAuth();

  const apiKey = "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";
  const groq = new Groq({ apiKey: apiKey, dangerouslyAllowBrowser: true });

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
          model: "llama3-8b-8192",
        });
        const responseString = response.choices[0].message.content;
        // Remove all escape sequences: \", \\ and \n
        const cleanedString = responseString.replace(/\\[\\n]/g, "");
        // console.log(cleanedString);
        const quizArray = JSON.parse(cleanedString);
        // console.log(quizArray);
        // console.log(typeof quizArray);
        setQuestions(quizArray);
        setFetched(true);
      } catch (error) {
        console.error("Failed to fetch quiz questions", error);
        if(!fetched) fetchQuestions();
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
      if(!user.email) return;
      const Task = subject + "-" + topic;
      const res = await getTasks(user.email);
      // console.log(res);
      const done = !res.tasks ? false : res.tasks.includes(Task);
      if(done) return;
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
  }

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizOver(true);
      let score = 0;
      Object.keys(selectedOptions).forEach((index) => {
        if (selectedOptions[index] === questions[index].correctAnswer) {
          score++;
        }
      });
      setScore(score);
      if(score == 5) handleBadges();
    }
  };

  const handleStart = () => {
    setStarted(true);
  };

  if (quizOver) {
    return (
      <div className="flex flex-col">
        <h2 className="text-4xl font-bold text-center">
          {top}
        </h2>
        <div className="min-h-[50vh] flex flex-col items-center justify-center ">
          {score === 5 ? (
            <LuBadgeCheck size={150} />
          ) : (
            <LuBadgeX size={150} />
          )}
          <p className="text-4xl mt-8">
            {score === 5 ? "Congratulations!! " : ""}
            You scored {score} out of {questions.length}!
          </p>
          <button
            className=" text-black font-bold p-4 rounded-md mt-8 hover:text-white transition-all border-solid border-black border-2 text-sm hover:bg-black"
            onClick={() => {
              setStarted(false);
              setQuizOver(false);
              setCurrentQuestion(0);
              setSelectedOptions({});
              setScore(0);
            }}
          >
            Take Quiz Again
          </button>
        </div>
      </div>
    );
  }
 

  if (questions.length === 0 && started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-h-[60vh]">
        {/* <p className="text-3xl font-semibold my-4">
          Loading Quiz
        </p> */}
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
      <h2 className="text-3xl font-bold text-center">
        {top}
      </h2>
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
            <p className="text-xl mb-4 font-semibold">
             {currentQuestion + 1}) {questions[currentQuestion].question}
            </p>
            <div>
              {questions[currentQuestion].options.map((option, index) => (
                <div className="flex items-center text-lg" key={index}>
                  <label htmlFor={option} className="cursor-pointer">
                    <input
                      id={option}
                      type="radio"
                      name="answer"
                      onChange={() => handleAnswer(option)}
                      className="mr-2 focus:ring-0 "
                      style={{
                        backgroundColor:
                          selectedOptions[currentQuestion] === option
                            ? "black"
                            : "",
                      }}
                      checked={selectedOptions[currentQuestion] === option}
                    />
                  </label>
                    {option}
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
