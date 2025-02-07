import React from "react";
import Carousel from "../../components/Carousel/Carousel";
import { Link } from "react-router-dom";
import { HiBadgeCheck } from "react-icons/hi";
import Progress from "../../components/Progress/Progress";
import { useAuth } from "../../services/AuthService";

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
    { label: "FLASK" },
    { label: "DJANGO" },
    { label: "NODE.JS" },
    { label: "EXPRESS.JS" },
    { label: "SPRING BOOT" },
    { label: "FASTAPI" },
  ];

  let { badges } = useAuth();
  badges = badges.filter((badge) => badge.id >= 24 && badge.id <= 29);
  // console.log(badges);

  for(let i = 0; i < badges.length; i++) {
    let val = Number.parseInt((badges[i].count / topics[i].count) * 100);
    // console.log(val);
    progress[i].value = val;
  }

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
              <div className="flex flex-col md:space-y-12 space-y-8 m-10">
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
              <div className="flex flex-col md:space-y-12 space-y-8 m-10">
                {badges.map((badge) => (
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

          <div className={`hidden md:grid md:grid-cols-2 md:gap-8 m-5`}>
            <Progress progress={progress} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Backend;
