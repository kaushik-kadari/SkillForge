import React, { useEffect, useState } from "react";

const sizeConfig = {
  sm: { size: "4.5rem", label: "text-xs sm:text-sm mt-3" },
  md: { size: "5.5rem", label: "text-sm md:text-base mt-3" },
  lg: { size: "6rem", label: "text-base xl:text-lg mt-4" },
};

const Progress = ({ progress, size = "lg", fill = false }) => {
  const [animatedProgress, setAnimatedProgress] = useState(
    progress.map(() => 0)
  );
  const config = sizeConfig[size] || sizeConfig.lg;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setAnimatedProgress(progress.map((item) => item.value));
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [progress]);

  return (
    <>
      {progress.map((item, index) => (
        <div
          key={`${item.label}-${index}`}
          className={
            fill
              ? "flex flex-col items-center justify-start text-center w-full min-w-0 h-full"
              : "flex flex-col items-center justify-start text-center min-w-0 w-[7.5rem] sm:w-[8.5rem] shrink-0"
          }
        >
          <div
            className="radial-progress bg-[#e4e2e2] text-primary-content border-[#e4e2e2] border-4 shrink-0"
            style={{
              "--value": animatedProgress[index],
              "--size": config.size,
              transition: "--value 2s ease",
            }}
            role="progressbar"
          >
            {animatedProgress[index]}%
          </div>
          <p
            className={`${config.label} leading-snug px-1 w-full min-h-[2.75rem] flex items-start justify-center text-center`}
            title={item.label}
          >
            <span className="line-clamp-2 break-words">{item.label}</span>
          </p>
        </div>
      ))}
    </>
  );
};

export default Progress;
