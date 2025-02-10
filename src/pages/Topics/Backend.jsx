import React, { useEffect, useState } from "react";
import Carousel from "../../components/Carousel/Carousel";
import { Link } from "react-router-dom";
import { HiBadgeCheck } from "react-icons/hi";
import Progress from "../../components/Progress/Progress";
import { useAuth } from "../../services/AuthService";
import { getTasks, addTask } from "../../services/contentService";

const Backend = () => {
  const heading = "Backend";

  const topics = [
    { path: "/topics/flask", label: "Flask", count: 12 },
    { path: "/topics/django", label: "Django", count: 14 },
    { path: "/topics/node-js", label: "Node.js", count: 14 },
    { path: "/topics/express-js", label: "Express.js", count: 13 },
    { path: "/topics/spring-boot", label: "Spring Boot", count: 14 },
    { path: "/topics/fastapi", label: "FastAPI", count: 13 },
  ];

  const progress = [
    { label: "FLASK", value: 0 },
    { label: "DJANGO", value: 0 },
    { label: "NODE.JS", value: 0 },
    { label: "EXPRESS.JS", value: 0 },
    { label: "SPRING BOOT", value: 0 },
    { label: "FASTAPI", value: 0 },
  ];

  const { user } = useAuth();
  const [tasks, setTasks] = useState(null);

  const checkTask = (topic, subject) => {
    // console.log(tasks);
    if(!tasks) return false;
    return tasks.includes(subject + "-" + topic);
  }
  
  let { badges, addBadge } = useAuth();
  let Badges = badges.filter((badge) => badge.id >= 24 && badge.id <= 29);
  // console.log(badges);

  const updateProgress = async () => {
    for(let i = 0; i < Badges.length; i++) {
      
      if(Badges[i].count == topics[i].count && !checkTask(topics[i].label, heading)) {  
        // console.log("yes");
        await addTask(user.email, heading + "-" + topics[i].label);
        await addBadge(3);
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
    <div>
      <h1 className="text-4xl font-bold text-center my-10">{heading}</h1>
      <div className="lg:grid lg:grid-cols-2 gap-4 p-10 flex flex-col max-h-2/3">
        <div className="bg-[#ebe7de5b] w-11/12 mx-auto rounded-md border shadow-lg p-2">
          <div className="grid grid-cols-2">
            <div className="w-11/12 mx-auto">
              <p className="bg-[#e4e2e2] text-2xl text-center rounded-md my-2">
                Topics
              </p>
              <div className="flex flex-col md:space-y-12 space-y-8 my-10">
                {topics.map((topic) => (
                  <Link
                    key={topic.path}
                    to={topic.path}
                    className="text-xl text-center"
                  >
                    {topic.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="w-11/12 mx-auto">
              <p className="bg-[#e4e2e2] text-2xl text-center rounded-md my-2">
                Badges
              </p>
              <div className="flex flex-col  md:space-y-12 space-y-8 my-10">
                {Badges.map((badge) => (
                  <div key={badge.id} className="mx-auto flex ">
                    <p className="text-xl">{Math.min(badge.count, topics[badge.id - 24].count)} of {topics[badge.id - 24].count}</p>
                    <HiBadgeCheck className="text-xl  ml-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#ebe7de5b] w-11/12 mx-auto rounded-md border shadow-lg p-2">
          <p className="text-2xl text-center m-2 p-2 bg-[#e4e2e2] rounded-md">
            Progress
          </p>

          <div className="md:hidden flex flex-col justify-center mt-8 md:mt-24">
            <div
              className="overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4"
              style={{ scrollBehavior: "smooth" }}
            >
              <div className="flex space-x-4 justify-start items-center">
                <Carousel progress={progress} />
              </div>
            </div>
          </div>

          <div className={`hidden md:grid md:grid-cols-2 md:gap-8 md:my-3`}>
            <Progress progress={progress} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Backend;
