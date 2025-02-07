import React from 'react';
import Carousel from "../components/Carousel/Carousel";
import { Link } from 'react-router-dom';
import { HiBadgeCheck } from "react-icons/hi";
import Progress from '../components/Progress/Progress';
import { useAuth } from '../services/AuthService';

const Dashboard = () => {
  const topics = [
    { path: "/languages", label: "Languages", index: 0, count: 12 },
    { path: "/frontend", label: "Frontend", index: 1, count: 6},
    { path: "/backend", label: "Backend", index: 2, count: 6}, 
    { path: "/topics/machine Learning", label: "Machine Learning", index: 3, count: 16}, 
    { path: "/topics/aptitude", label: "Aptitude", index: 4, count: 34}, 
  ];

  const progress = [
    { label: "Languages" },
    { label: "Frontend" },
    { label: "Backend" },
    { label: "Machine Learning" },
    { label: "Aptitude" }
  ];

  let { badges } = useAuth();
  badges = badges.filter((badge) => badge.id >= 1 && badge.id <= 5);
  // console.log(badges);

  for(let i = 0; i < badges.length; i++) {
    let val = Number.parseInt((badges[i].count / topics[i].count) * 100);
    // console.log(val);
    progress[i].value = val;
  }

  const heading="Dashboard";

  return (
    <>
      <div>
        <h1 className='text-4xl font-bold text-center my-10'>{heading}</h1>
        <div className="lg:grid lg:grid-cols-3 gap-4 p-10 flex flex-col max-h-2/3">
          <div className="bg-[#ebe7de5b] w-11/12 mx-auto rounded-md border shadow-lg p-2">
            <div className='grid grid-cols-2 gap-4'>
              <div className='w-11/12 mx-auto'>
                <p className='bg-[#e4e2e2] text-2xl text-center rounded-md my-2'>Topics</p>
                <div className='flex flex-col md:space-y-12 space-y-8 my-5'>
                  {topics.map((topic) => (
                    <Link key={topic.index} to={topic.path} className="text-xl text-center">
                      {topic.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div className='w-11/12 mx-auto'>
                <p className='bg-[#e4e2e2] text-2xl text-center rounded-md my-2'>Badges</p>
                <div className='flex flex-col  md:space-y-12 space-y-8 my-5'>
                  {badges.map((badge) => (
                    <div key={badge.id} className='mx-auto flex'>
                      <p className='text-xl'>{Math.min(badge.count, topics[badge.id - 1].count)} of {topics[badge.id - 1].count}</p>
                      <HiBadgeCheck className='text-xl ml-2 md:block'/>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className='bg-[#ebe7de5b] w-11/12 mx-auto rounded-md border shadow-lg md:col-span-2'>
            <p className='text-2xl text-center m-4 p-2 bg-[#e4e2e2] rounded-md'>Progress</p>

            <div className="md:hidden flex flex-col justify-center mt-8 md:mt-24">
              <div className="overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4" style={{ scrollBehavior: 'smooth' }}>
                <div className="flex space-x-4 justify-start items-center">
                  <Carousel progress={progress} />
                </div>
              </div>
            </div>

            <div className={`hidden md:grid md:grid-cols-5 md:gap-8 md:mt-8 lg:mt-24`}>
              <Progress progress={progress} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;