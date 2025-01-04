import React from "react";
import { useEffect, useState } from "react";
import Content from '../Content/Content';
import Carousel from '../Carousel/Carousel';
import Topic from '../Topic/Topic';

const Progress = ({ progress }) => {
  const [animatedProgress, setAnimatedProgress] = useState(
    progress.map(() => 0)
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setAnimatedProgress(progress.map((item) => item.value));
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [progress]);

  return (
    <>
      {progress.map((item, index) => (
        <div key={index} className="text-center">
          <div
            className="radial-progress bg-[#e4e2e2] text-primary-content border-[#e4e2e2] border-4 mx-auto"
            style={{
              "--value": animatedProgress[index],
              transition: "var(--value) 2s ease",
            }}
            role="progressbar"
          >
            {animatedProgress[index]}%
          </div>
          <p className="text-xl mt-4">{item.label}</p>
        </div>
      ))}
    </>
  );
};

export default Progress;
