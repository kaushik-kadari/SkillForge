import React, { useEffect, useState } from 'react';
import { HiBadgeCheck } from "react-icons/hi";
import { Link } from 'react-router-dom';
import Carousel from '../../components/Carousel/Carousel.jsx';
import Progress from '../../components/Progress/Progress.jsx';
import { useAuth } from '../../services/AuthService.jsx';
import { getTasks, addTask } from '../../services/contentService';
import { useLocation } from 'react-router-dom';

const Languages = () => {
  const topics = [
      { path: "/topics/c", label: "C", count: 19 },
      { path: "/topics/cplusplus", label: "C++", count: 16 },
      { path: "/topics/csharp", label: "C#", count: 19 },
      { path: "/topics/go", label: "Go", count: 18 },
      { path: "/topics/java", label: "Java", count: 20 },
      { path: "/topics/javascript", label: "JavaScript", count: 17 },
      { path: "/topics/kotlin", label: "Kotlin", count: 15 },
      { path: "/topics/php", label: "PHP", count: 16 },
      { path: "/topics/python", label: "Python", count: 20 },
      { path: "/topics/ruby", label: "Ruby", count: 15 },
      { path: "/topics/swift", label: "Swift", count: 17 },
      { path: "/topics/typescript", label: "TypeScript", count: 15 }
  ];
  
  const progress = [
    { label: "C", value: 0 },
    { label: "C++", value: 0 },
    { label: "C#", value: 0 },
    { label: "Go", value: 0 },
    { label: "Java", value: 0 },
    { label: "JavaScript", value: 0 },
    { label: "Kotlin", value: 0 },
    { label: "PHP", value: 0 },
    { label: "Python", value: 0 },
    { label: "Ruby", value: 0 },
    { label: "Swift", value: 0 },
    { label: "TypeScript", value: 0 }
  ];
  
  const heading = "Languages";
  const { user } = useAuth();
  const [tasks, setTasks] = useState(null);
  const location = useLocation();

  const checkTask = (topic, subject) => {
    // console.log(tasks);
    if(!tasks) return false;
    return tasks.includes(subject + "-" + topic);
  }
  
  let { badges, addBadge } = useAuth();
  let Badges = badges.filter((badge) => badge.id >= 6 && badge.id <= 17);
  // console.log(badges);

  const updateProgress = async () => {
    for(let i = 0; i < Badges.length; i++) {
      
      if(Badges[i].count == topics[i].count && !checkTask(topics[i].label, heading)) {  
        // console.log("yes");
        await addTask(user.email, heading + "-" + topics[i].label);
        await addBadge(1);
      }
      
      let val = Number.parseInt((Badges[i].count / topics[i].count) * 100);
      // console.log(val);
      progress[i].value = val;
    }
    // console.log(progress);
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
      // console.log("yes");
      updateProgress();  
    }
  }, [tasks]);
  return (
    <>
      <div>
        <h1 className='text-4xl font-bold text-center my-10'>{heading}</h1>
        <div className="lg:grid lg:grid-cols-2 gap-4 p-10 flex flex-col max-h-2/3">
          <div className="bg-[#ebe7de5b] w-11/12 mx-auto rounded-md border shadow-lg p-2">
            <div className='grid grid-cols-2 gap-4'>
              <div className='w-11/12 mx-auto'>
                <p className='bg-[#e4e2e2] text-2xl text-center rounded-md'>Topics</p>
                <div className='flex flex-col md:space-y-12 space-y-8 my-10 '>
                  {topics.map((topic) => (
                    <Link key={topic.path} to={topic.path} className="text-xl text-center">
                      {topic.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div className=''>
                <p className='bg-[#e4e2e2] text-2xl text-center rounded-md'>Badges</p>
                <div className='flex flex-col md:space-y-12 space-y-8 my-10'>
                  {Badges.map((badge) => (
                    <div key={badge.id} className='mx-auto flex'>
                    <p className="text-xl">{Math.min(badge.count, topics[badge.id - 6].count)} of {topics[badge.id - 6].count}</p>
                    <HiBadgeCheck className='text-xl ml-2'/>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className='bg-[#ebe7de5b] mx-auto rounded-md border shadow-lg w-11/12'>
            <p className='text-2xl text-center m-3 p-2 bg-[#e4e2e2] rounded-md'>Progress</p>
            
            <div className="md:hidden flex flex-col justify-center mt-8 md:mt-24">
              <div className="overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4" style={{ scrollBehavior: 'smooth' }}>
                <div className="flex space-x-4 justify-start items-center">
                  <Carousel progress={progress} />
                </div>
              </div>
            </div>

            <div className={`hidden md:grid md:grid-cols-2 md:gap-8 md:my-4 lg:mt-8`}>
              <Progress progress={progress} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Languages;