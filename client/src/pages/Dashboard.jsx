import React from "react";
import Carousel from "../components/Carousel/Carousel";
import { Link } from "react-router-dom";
import { HiBadgeCheck } from "react-icons/hi";
import Progress from "../components/Progress/Progress";
import { useAuth } from "../services/AuthService";
import { FallingLines } from "react-loader-spinner";

const Dashboard = () => {
  const topics = [
    { path: "/languages", label: "Languages", index: 0, count: 12 },
    { path: "/frontend", label: "Frontend", index: 1, count: 6 },
    { path: "/backend", label: "Backend", index: 2, count: 6 },
    { path: "/topics/machine Learning", label: "Machine Learning", index: 3, count: 16 },
    { path: "/topics/aptitude", label: "Aptitude", index: 4, count: 34 },
  ];

  const progress = [
    { label: "Languages", value: 0 },
    { label: "Frontend", value: 0 },
    { label: "Backend", value: 0 },
    { label: "Machine Learning", value: 0 },
    { label: "Aptitude", value: 0 },
  ];

  let { badges, loading } = useAuth();
  badges = badges.filter((badge) => badge.id >= 1 && badge.id <= 5);

  for (let i = 0; i < badges.length; i++) {
    let val = Number.parseInt((badges[i].count / topics[i].count) * 100);
    progress[i].value = Math.min(val, 100);
  }

  const heading = "Dashboard";

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FallingLines
          color="black"
          width="150"
          visible={true}
          ariaLabel="falling-circles-loading"
        />
      </div>
    );

  return (
    <div className="w-full min-w-0 overflow-x-hidden px-3 py-6 sm:px-5 sm:py-8 md:px-8 md:py-10 lg:px-10">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-10">
        {heading}
      </h1>

      <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {/* Topics & Badges */}
        <div className="bg-[#ebe7de5b] w-full min-w-0 rounded-md border shadow-lg p-2 sm:p-3">
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            <div className="min-w-0 w-full px-1 sm:px-2">
              <p className="bg-[#e4e2e2] text-base sm:text-xl md:text-2xl text-center rounded-md my-1 sm:my-2 py-1 sm:py-1.5 font-medium">
                Topics
              </p>
              <div className="flex flex-col gap-5 sm:gap-6 md:gap-8 lg:gap-10 my-3 sm:my-5">
                {topics.map((topic) => (
                  <Link
                    key={topic.index}
                    to={topic.path}
                    className="text-sm sm:text-base md:text-lg lg:text-xl text-center leading-snug hover:underline underline-offset-2 break-words"
                  >
                    {topic.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="min-w-0 w-full px-1 sm:px-2">
              <p className="bg-[#e4e2e2] text-base sm:text-xl md:text-2xl text-center rounded-md my-1 sm:my-2 py-1 sm:py-1.5 font-medium">
                Badges
              </p>
              <div className="flex flex-col gap-5 sm:gap-6 md:gap-8 lg:gap-10 my-3 sm:my-5">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="mx-auto flex items-center justify-center gap-1 sm:gap-2 min-w-0"
                  >
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl whitespace-nowrap">
                      {Math.min(badge.count, topics[badge.id - 1].count)} of{" "}
                      {topics[badge.id - 1].count}
                    </p>
                    <HiBadgeCheck className="text-base sm:text-lg md:text-xl shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-[#ebe7de5b] w-full min-w-0 rounded-md border shadow-lg lg:col-span-2 p-2 sm:p-3 pb-4 sm:pb-6">
          <p className="text-base sm:text-xl md:text-2xl text-center m-2 sm:m-3 md:m-4 p-1.5 sm:p-2 bg-[#e4e2e2] rounded-md font-medium">
            Progress
          </p>

          {/* Phone: carousel */}
          <div className="md:hidden flex flex-col justify-center mt-4 sm:mt-6 pb-2">
            <Carousel progress={progress} />
          </div>

          {/* Tablet: wrapped row */}
          <div className="hidden md:flex lg:hidden flex-wrap justify-center gap-x-8 gap-y-8 mt-8 px-2">
            <Progress progress={progress} size="md" />
          </div>

          {/* Desktop: full row */}
          <div className="hidden lg:grid lg:grid-cols-5 lg:gap-4 xl:gap-8 mt-10 xl:mt-16 px-2 xl:px-4 place-items-stretch">
            <Progress progress={progress} size="lg" fill />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
