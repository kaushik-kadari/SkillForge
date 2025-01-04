import React, { useState, useEffect } from "react";
import axios from "axios";
import Groq from "groq-sdk";

const Quiz = ({ subject, topic }) => {
  const sub = subject.toUpperCase();
  const top = topic.toUpperCase();
  const [questions, setQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizOver, setQuizOver] = useState(false);

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
      } catch (error) {
        console.error("Failed to fetch quiz questions:", error);
      }
    };

    fetchQuestions();
  }, [subject, topic]);

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
    }
  };

  if (quizOver) {
    return (
      <h2>
        Your score: {score} / {questions.length}
      </h2>
    );
  }

  if (questions.length === 0) {
    return <p>Loading quiz...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-center">
        {sub} - {top}
      </h2>
      <div className="mt-4 p-4">
        <p className="text-xl mb-4 ">
          Question {currentQuestion + 1}: {questions[currentQuestion].question}
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
                {option}
              </label>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4">
          <button
            className="bg-black hover:bg-black text-white font-bold py-2 px-4 rounded"
            onClick={handlePreviousQuestion}
          >
            <i className="fas fa-arrow-left mr-2"></i> Previous
          </button>

          {currentQuestion + 1 < questions.length && (
            <button
              className={`bg-black hover:bg-black text-white font-bold py-2 px-4 rounded ${
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
            className={`bg-black hover:bg-black text-white font-bold py-2 px-4 rounded ${
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
    </div>
  );
};

export default Quiz;
