import React from "react";
import { Link } from "react-router-dom";
import Content from "./Content";
import { useNavigate } from "react-router-dom";

function Topic({ topics }) {
  const navigate = useNavigate();
  const renderContent = (topic, subject) => {
    // console.log(topic);
    navigate("/content", { state: { topic, subject} });
  }

  return (
    <div className="lg:grid lg:grid-cols-3 gap-10 p-10 flex flex-col">
      <div className="text-center bg-[#ebe7de5b] p-2 rounded-md shadow-lg border">
        <h1 className="bg-[#e4e2e2] text-2xl text-center rounded-md my-2">
          Topics
        </h1>
        <div className="flex flex-col md:space-y-12 space-y-8 my-5 max-h-[60vh] overflow-y-scroll">
          {topics.map((topic, index) => (
            <p key={index} className="text-xl text-center cursor-pointer" onClick={() => renderContent(topic.label, topic.subject)}>{topic.label}</p>
          ))}
        </div>
      </div>

      <div className="text-center bg-[#ebe7de5b] p-2 rounded-md shadow-lg border col-span-2">
        <h1 className="bg-[#e4e2e2] text-2xl text-center rounded-md my-2" >
          Short Notes
        </h1>
      </div>
    </div>
  );
}

export default Topic;
