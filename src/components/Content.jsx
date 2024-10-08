import React from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import GenerateContent from "./GenerateContent";
import { useParams } from "react-router-dom";

import { AiOutlineRead } from "react-icons/ai";
import { FiPlayCircle } from "react-icons/fi";
import { BiTargetLock } from "react-icons/bi";
import { BsChatRightText } from "react-icons/bs";
import { VscFeedback } from "react-icons/vsc";
import { FaStar } from "react-icons/fa";

const Content = () => {
  const [showContent, setShowContent] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const location = useLocation();

  let { subject, topic } = useParams();

  subject = subject.toUpperCase();

  const questions = [
    "How would you rate the content quality?",
    "How clear was the explanation of the topics?",
    "Was the content helpful for your learning?",
    "How was the overall user experience on the platform?",
    "Would you recommend this platform to others?",
  ];

  const [ratings, setRatings] = useState(Array(questions.length).fill(0));
  const [hovered, setHovered] = useState(Array(questions.length).fill(null));

  const handleRating = (index, value) => {
    const newRatings = [...ratings];
    newRatings[index] = value;
    setRatings(newRatings);
  };

  const handleHover = (index, value) => {
    const newHovered = [...hovered];
    newHovered[index] = value;
    setHovered(newHovered);
  };

  const handleHoverLeave = (index) => {
    const newHovered = [...hovered];
    newHovered[index] = null;
    setHovered(newHovered);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback submitted:", ratings);
    setRatings(Array(questions.length).fill(0));
  };

  const handleClick = (type) => {
    setShowContent(type === "content");
    setShowVideo(type === "video");
    setShowQuiz(type === "quiz");
    setShowChat(type === "chat");
    setShowFeedback(type === "feedback");
  };

  return (
    <div className="grid grid-cols-3 p-7 gap-5 items-start">
      <div className="w-11/12 mx-auto bg-[#ebe7de5b] p-2 rounded-md border shadow-lg">
        <h1 className="text-2xl font-bold text-center my-2 underline border-b-2 pb-4 cursor-pointer">
          {subject}
        </h1>
        <p className="text-xl text-center font-semibold my-4">{topic} </p>
        <div className="flex flex-col md:space-y-5 space-y-8 p-1">
          <p
            className={`text-xl flex items-center gap-3 cursor-pointer ${
              showContent && "bg-[#e4e2e2]"
            } p-2 rounded-md hover:bg-[#e4e2e2] transition-all duration-300`}
            onClick={() => handleClick("content")}
          >
            <AiOutlineRead style={{ opacity: "0.5" }} /> Read Content
          </p>
          <p
            className={`text-xl flex items-center gap-3 cursor-pointer ${
              showVideo && "bg-[#e4e2e2]"
            } p-2 rounded-md hover:bg-[#e4e2e2] transition-all duration-300`}
            onClick={() => handleClick("video")}
          >
            <FiPlayCircle style={{ opacity: "0.5" }} /> Watch Video
          </p>
          <p
            className={`text-xl flex items-center gap-3 cursor-pointer ${
              showQuiz && "bg-[#e4e2e2]"
            }  p-2 rounded-md hover:bg-[#e4e2e2] transition-all duration-300`}
            onClick={() => handleClick("quiz")}
          >
            <BiTargetLock style={{ opacity: "0.5" }} /> Take Quiz
          </p>
          <p
            className={`text-xl flex items-center gap-3 cursor-pointer ${
              showChat && "bg-[#e4e2e2]"
            } p-2 rounded-md hover:bg-[#e4e2e2] transition-all duration-300`}
            onClick={() => handleClick("chat")}
          >
            <BsChatRightText style={{ opacity: "0.5" }} /> Chat with PDF
          </p>
          <p
            className={`text-xl flex items-center gap-3 cursor-pointer ${
              showFeedback && "bg-[#e4e2e2]"
            } p-2 rounded-md hover:bg-[#e4e2e2] transition-all duration-300`}
            onClick={() => handleClick("feedback")}
          >
            <VscFeedback style={{ opacity: "0.5" }} /> Feedback
          </p>
        </div>
      </div>

      {showContent && (
        <div className="w-full mx-auto col-span-2 bg-[#ebe7de5b] p-2 rounded-md border shadow-lg min-h-[100vh] max-h-[100vh] overflow-y-scroll ">
          <h1 className="text-2xl font-bold text-center mt-2">
            {topic}
          </h1>
          <p className="text-wrap p-10">
            <GenerateContent topic={topic} subject={subject} />
          </p>
        </div>
      )}

      {showVideo && (
        <div className="w-full mx-auto col-span-2 bg-[#ebe7de5b] p-10 rounded-md border shadow-lg min-h-[70vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Machine Learning</h1>
            <p>Reference Video</p>
          </div>
          <iframe
            className="w-full h-[60vh] rounded-lg mx-auto mt-10 border border-black shadow-lg"
            src="https://www.youtube.com/embed/ukzFI9rgwfU?si=qNO_N3K5G0GHwP3J"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </div>
      )}

      {showQuiz && (
        <div className="w-full mx-auto col-span-2 bg-[#ebe7de5b] p-10 rounded-md border shadow-lg min-h-[70vh]">
          <div>Quiz</div>
        </div>
      )}

      {showChat && (
        <div className="w-full mx-auto col-span-2 bg-[#ebe7de5b] p-10 rounded-md border shadow-lg min-h-[70vh]">
          <div>Chat</div>
        </div>
      )}

      {showFeedback && (
        <div className="w-full mx-auto col-span-2 bg-[#ebe7de5b] p-10 rounded-md border shadow-lg min-h-[70vh]">
          <h1 className="text-2xl font-bold mb-2 text-center">
            Machine Learning
          </h1>
          <h1 className="text-xl font-semibold  text-center my-4">
            We value your feedback!
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            {questions.map((question, index) => (
              <div key={index} className="">
                <p className="text-xl mb-2">{question}</p>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <FaStar
                      key={starValue}
                      size={30}
                      onClick={() => handleRating(index, starValue)}
                      onMouseEnter={() => handleHover(index, starValue)}
                      onMouseLeave={() => handleHoverLeave(index)}
                      className={`cursor-pointer transition-all duration-200 ${
                        (hovered[index] || ratings[index]) >= starValue
                          ? "text-[#292929] scale-110"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
            <button
              type="submit"
              className="bg-[#292929] text-white font-bold py-2 px-4 rounded-md mx-auto"
            >
              Submit Feedback
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Content;
