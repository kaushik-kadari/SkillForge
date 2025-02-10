import React from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { AiOutlineRead } from "react-icons/ai";
import { FiPlayCircle } from "react-icons/fi";
import { BiTargetLock } from "react-icons/bi";
import { BsChatRightText } from "react-icons/bs";
import { VscFeedback } from "react-icons/vsc";
import { FaStar } from "react-icons/fa";
import Carousel from "../Carousel/Carousel";
import GenerateContent from "../GenerateContent/GenerateContent";
import Quiz from "../Quiz/quizGenerator";
import Navbar from "../Navbar/Navbar";
import Progress from "../Progress/Progress";
import Topic from "../Topic/Topic";
import ChatAi from "../ChatAi/ChatAi";
import "./Content.css";
import { getVideoLink, addVideoLink } from "../../services/contentService";
import { useAuth } from "../../services/AuthService";

const Content = () => {
  const location = useLocation();
  let { subject, topic, id } = useParams();
  const Subject = subject.toUpperCase();
  const [videoLink, setVideoLink] = useState("");
  const { user } = useAuth();

  // console.log(subject, topic, id);

  const API_KEY = "AIzaSyD1BoZKkwFHlc67eoW8e56c06Zb7x2vYEk"; // yt key

  const Content = location.pathname.split("/");
  const navigate = useNavigate();

  const [showContent, setShowContent] = useState(
    Content[5] === "content" ? true : false
  );
  const [showVideo, setShowVideo] = useState(
    location.pathname === `/content/${subject}/${topic}/video` ? true : false
  );
  const [showQuiz, setShowQuiz] = useState(
    location.pathname === `/content/${subject}/${topic}/quiz` ? true : false
  );
  const [showChat, setShowChat] = useState(
    location.pathname === `/content/${subject}/${topic}/chat` ? true : false
  );
  const [showFeedback, setShowFeedback] = useState(
    location.pathname === `/content/${subject}/${topic}/feedback` ? true : false
  );

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

    const feedbacks = questions.map((question, index) => ({
      question,
      rating: ratings[index],
    }));

    // console.log("Feedback submitted:", feedbacks);

    // Reset the ratings and hovered state
    setRatings(Array(questions.length).fill(0));
    setHovered(Array(questions.length).fill(null));

    const name = user.name;
    const email = user.email;

    // Send the feedback data to the server
    axios
      .post("http://localhost:3000/api/add-feedback", {
        name,
        email,
        subject,
        topic,
        feedbacks,
      })
      .then((res) => {
        toast.success("Feedback submitted successfully!");
        // console.log(res.data);
      });
  };

  const handleClick = (type) => {
    setShowContent(type === "content");
    setShowVideo(type === "video");
    setShowQuiz(type === "quiz");
    setShowChat(type === "chat");
    setShowFeedback(type === "feedback");

    navigate(`/content/${subject}/${topic}/${id}/${type}`);
  };

  const generateVideoLink = async (subject, topic) => {
    try {
      // console.log(subject, topic);
      const searchQuery = `${subject} ${topic}`;
      const maxResults = 1; // Adjust as needed
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        searchQuery
      )}&key=${API_KEY}&type=video&maxResults=${maxResults}&order=relevance`;

      const response = await axios.get(url);
      // console.log("vid id", response.data.items[0].id.videoId);
      return "https://www.youtube.com/embed/" + response.data.items[0].id.videoId;
    } catch (error) {
      console.error("Error generating video link:", error);
      return error;
    }
  };

  useEffect(() => {
    handleVideoLink();
  }, []);

  const handleVideoLink = async () => {
    try {
      // console.log("handleVideoLink");
      const response = await getVideoLink(subject, topic);
      // console.log(response);
      if (response.status === 404 || response.status === 500) {
        const videoLink = await generateVideoLink(subject, topic);
        setVideoLink(videoLink);
        const res = await addVideoLink(subject, topic, videoLink);
        // console.log(res);
      } else {
        setVideoLink(response.videoLink);
      }
    } catch (error) {
      console.error("Error fetching video link:", error);
    }
  };

  useEffect(() => {
    // handleVideoLink();
    setShowContent(Content[5] === "content" ? true : false);
    setShowVideo(Content[5] === "video" ? true : false);
    setShowQuiz(Content[5] === "quiz" ? true : false);
    setShowChat(Content[5] === "chat" ? true : false);
    setShowFeedback(Content[5] === "feedback" ? true : false);
  }, [location.pathname]);

  return (
    <div className="md:grid md:grid-cols-3 p-7 gap-5 items-start ">
      <div className="w-full md:w-11/12 mb-8 mx-auto bg-[#ebe7de5b] p-2 rounded-md border shadow-lg">
        <h1 className="text-2xl font-bold text-center my-2 underline border-b-2 pb-4 cursor-pointer">
          <Link to={`/topics/${subject}`}>{Subject}</Link>
        </h1>
        <p className="text-2xl text-center font-semibold my-4">{topic} </p>
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
            <BsChatRightText style={{ opacity: "0.5" }} /> AI Assistant
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
        <div className="w-full mx-auto col-span-2 bg-[#ebe7de5b] p-2 rounded-md border shadow-lg min-h-[80vh] max-h-[80vh] overflow-y-scroll">
          <h1 className="text-2xl font-bold text-center mt-2">{topic}</h1>
          <div className="text-wrap p-10">
            <GenerateContent topic={topic} subject={subject} />
          </div>
        </div>
      )}

      {showVideo && (
        <div className="w-full mx-auto col-span-2 bg-[#ebe7de5b] p-10 rounded-md border shadow-lg min-h-[80vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">{topic}</h1>
            <p>Reference Video</p>
          </div>
          <iframe
            className="w-full h-[60vh] rounded-lg mx-auto mt-10 border border-black shadow-lg"
            src={videoLink}
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
      )}

      {showQuiz && (
        <div className="w-full mx-auto col-span-2 bg-[#ebe7de5b] p-10 rounded-md border shadow-lg min-h-[80vh]">
          <Quiz subject={subject} topic={topic} id={id}/>
        </div>
      )}

      {showChat && (
        <div className="w-full mx-auto col-span-2 bg-[#ebe7de5b] p-10 rounded-md border shadow-lg min-h-[80vh]">
          <ChatAi subject={subject} topic={topic} />
        </div>
      )}

      {showFeedback && (
        <div className="w-full mx-auto col-span-2 bg-[#ebe7de5b] p-10  shadow-lg min-h-[80vh]">
          <h1 className="text-2xl font-bold mb-2 text-center">
            { topic }
          </h1>
          <h1 className="text-xl font-semibold  text-center my-4">
            We value your feedback!
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col border-none space-y-6">
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
              className="bg-[#292929] hover:bg-[#676767] text-white font-bold py-2 px-4 rounded-md mx-auto"
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
