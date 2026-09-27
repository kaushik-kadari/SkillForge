import React, { useEffect, useState } from 'react';
import { HiBadgeCheck } from "react-icons/hi";
import { Link, useLocation } from 'react-router-dom';
import Carousel from '../../components/Carousel/Carousel';
import Progress from '../../components/Progress/Progress';
import { useAuth } from '../../services/AuthService';
import { getTasks, addTask } from '../../services/contentService';

const Frontend = () => {
  const topics = [
    { path: "/topics/html", label: "HTML", count: 10 },
    { path: "/topics/css", label: "CSS", count: 14 },
    { path: "/topics/javascriptDev", label: "JAVASCRIPT", count: 17 },
    { path: "/topics/react-js", label: "REACT.JS", count: 16 },
    { path: "/topics/next-js", label: "NEXT.JS", count: 15 },
    { path: "/topics/tailwind-css", label: "TAILWIND.CSS", count: 14 }
  ];

  const progress = [
    { label: "HTML", value: 0 },
    { label: "CSS", value: 0 },
    { label: "JAVASCRIPT", value: 0 },
    { label: "REACT.JS", value: 0 },
    { label: "NEXT.JS", value: 0 },
    { label: "TAILWIND.CSS", value: 0 },
  ];

  const heading = "Frontend";
  const { user } = useAuth();
  const [tasks, setTasks] = useState(null);
  const location = useLocation();

  const checkTask = (topic, subject) => {
    // console.log(tasks);
    if(!tasks) return false;
    return tasks.includes(subject + "-" + topic);
  }
  
  let { badges, addBadge } = useAuth();
  let Badges = badges.filter((badge) => badge.id >= 18 && badge.id <= 23);
  // console.log(badges);

  const updateProgress = async () => {
    for(let i = 0; i < Badges.length; i++) {
      
      if(Badges[i].count == topics[i].count && !checkTask(topics[i].label, heading)) {  
        // console.log("yes");
        await addTask(user.email, heading + "-" + topics[i].label);
        await addBadge(2);
      }
      
      let val = Number.parseInt((Badges[i].count / topics[i].count) * 100);
      // console.log(val);
      progress[i].value = val;
    }
  }

  useEffect(() => {
    const fetchTasks = async () => {
      if (user.email) { 
        try {
          const res = await getTasks(user.email);
          // console.log(res);
          setTasks(res.tasks);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      }
    };
    
    fetchTasks(); 
  }, [user.email, badges]);

  useEffect(() => {
    if (tasks !== null) {
      updateProgress();  
    }
  }, [tasks]); 

  return (
    <div className="w-full min-w-0 px-3 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-10">
        {heading}
      </h1>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Topics & Badges */}
        <div className="bg-[#ebe7de5b] w-full h-[60vh] sm:h-[65vh] rounded-md border shadow-lg p-2 flex flex-col min-h-0">
          <div className="grid grid-cols-2 gap-2 sm:gap-4 shrink-0">
            <p className="bg-[#e4e2e2] text-lg sm:text-xl md:text-2xl text-center rounded-md my-2 py-1.5 font-medium">
              Topics
            </p>
            <p className="bg-[#e4e2e2] text-lg sm:text-xl md:text-2xl text-center rounded-md my-2 py-1.5 font-medium">
              Badges
            </p>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain pr-1">
            <div className="grid grid-cols-2 gap-2 sm:gap-4 py-4">
              <div className="flex flex-col gap-8 md:gap-12">
                {topics.map((topic) => (
                  <Link
                    key={topic.path}
                    to={topic.path}
                    className="text-base sm:text-lg md:text-xl text-center leading-snug hover:underline underline-offset-2"
                  >
                    {topic.label}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col gap-8 md:gap-12">
                {Badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="mx-auto flex items-center justify-center gap-1 sm:gap-2"
                  >
                    <p className="text-base sm:text-lg md:text-xl whitespace-nowrap">
                      {Math.min(badge.count, topics[badge.id - 18].count)} of{" "}
                      {topics[badge.id - 18].count}
                    </p>
                    <HiBadgeCheck className="text-lg md:text-xl shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Progress — compact on small screens (carousel), fixed height from md up */}
        <div className="bg-[#ebe7de5b] w-full h-auto md:h-[60vh] lg:h-[65vh] rounded-md border shadow-lg p-2 flex flex-col min-h-0">
          <p className="shrink-0 text-lg sm:text-xl md:text-2xl text-center m-2 p-2 bg-[#e4e2e2] rounded-md font-medium">
            Progress
          </p>
          <div className="md:flex-1 md:min-h-0 md:overflow-y-auto overscroll-contain">
            <div className="md:hidden flex flex-col justify-center py-3 sm:py-4">
              <Carousel progress={progress} />
            </div>
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 py-6 px-3 sm:px-6 place-items-stretch">
              <Progress progress={progress} size="md" fill />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Frontend;