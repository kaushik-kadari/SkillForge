import React from 'react';
import { ImFire } from "react-icons/im";
import { Link } from 'react-router-dom';
import Carousel from '../../components/Carousel/Carousel';
import Progress from '../../components/Progress/Progress';

const Frontend = () => {
  const topics = [
    { path: "/topics/html", label: "HTML" },
    { path: "/topics/css", label: "CSS" },
    { path: "/topics/javascript", label: "JAVASCRIPT" },
    { path: "/topics/react-js", label: "REACT.JS" },
    { path: "/topics/next-js", label: "NEXT.JS" },
    { path: "/topics/tailwind-css", label: "TAILWIND.CSS" }  ];

  const progress = [
    { label: "HTML", value: 10 },
    { label: "CSS", value: 100 },
    { label: "JAVASCRIPT", value: 70 },
    { label: "TAILWIND.CSS", value: 100 },
    { label: "REACT.JS", value: 100 },
    { label: "NEXT.JS", value: 70 },
  ];

  const badges = [
    { id: 1 ,count:5 },
    { id: 2 ,count:6 },
    { id: 3 ,count:7 },
    { id: 4 ,count:10},
    { id: 5 ,count:5},
    { id: 6 ,count:6},
  ];

  const heading = "Frontend";

  return (
    <div>
      <h1 className='text-4xl font-bold text-center my-10'>{heading}</h1>
      <div className="lg:grid lg:grid-cols-2 gap-4 p-10 flex flex-col max-h-2/3">
        <div className="bg-[#ebe7de5b] w-11/12 mx-auto rounded-md border shadow-lg p-2">
          <div className='grid grid-cols-2'>
            <div className='w-11/12 mx-auto'>
              <p className='bg-[#e4e2e2] text-2xl text-center rounded-md my-2'>Topics</p>
              <div className='flex flex-col md:space-y-12 space-y-8 my-10'>
                {topics.map((topic) => (
                  <Link 
                    key={topic.path}
                    to={topic.path} 
                    className='text-xl text-center'
                  >
                    {topic.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className='w-11/12 mx-auto'>
              <p className='bg-[#e4e2e2] text-2xl text-center rounded-md my-2'>Badges</p>
              <div className='flex flex-col md:space-y-12 space-y-8 mt-10'>
                {badges.map((badge) => (
                  <div key={badge.id} className='mx-auto flex '>
                    <p className='text-xl'>{badge.count}</p>
                    <ImFire className='text-xl ml-2'/>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#ebe7de5b] w-11/12 mx-auto rounded-md border shadow-lg p-2">
          <p className='text-2xl text-center m-2 p-2 bg-[#e4e2e2] rounded-md'>Progress</p>
          <div className="md:hidden flex flex-col justify-center mt-8 md:mt-24">
              <div className="overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4" style={{ scrollBehavior: 'smooth' }}>
                <div className="flex space-x-4 justify-start items-center">
                  <Carousel progress={progress} />
                </div>
              </div>
            </div>
            
            <div className={`hidden md:grid md:grid-cols-2 md:gap-8 md:mt-8 lg:mt-8`}>
              <Progress progress={progress} />
            </div>
        </div>
      </div>
    </div>
  );
}

export default Frontend;