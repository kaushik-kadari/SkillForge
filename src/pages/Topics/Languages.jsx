import React from 'react';
import { ImFire } from "react-icons/im";
import { Link } from 'react-router-dom';
import Carousel from '../../components/Carousel/Carousel.jsx';
import Progress from '../../components/Progress/Progress.jsx';

const Languages = () => {
  const topics = [
    { path: "/topics/c", label: "C" },
    { path: "/topics/cplusplus", label: "C++" },
    { path: "/topics/csharp", label: "C#" },
    { path: "/topics/go", label: "Go" },
    { path: "/topics/java", label: "Java" },
    { path: "/topics/javascript", label: "JavaScript" },
    { path: "/topics/kotlin", label: "Kotlin" },
    { path: "/topics/php", label: "PHP" },
    { path: "/topics/python", label: "Python" },
    { path: "/topics/ruby", label: "Ruby" },
    { path: "/topics/swift", label: "Swift" },
    { path: "/topics/typescript", label: "TypeScript" }
  ];
  
  const progress = [
    { label: "C", value: 20 },
    { label: "C++", value: 40 },
    { label: "C#", value: 50 },
    { label: "Go", value: 30 },
    { label: "Java", value: 80 },
    { label: "JavaScript", value: 90 },
    { label: "Kotlin", value: 35 },
    { label: "PHP", value: 45 },
    { label: "Python", value: 75 },
    { label: "Ruby", value: 25 },
    { label: "Swift", value: 60 },
    { label: "TypeScript", value: 70 }
  ];
  

  const badges = [
    { id: 1 ,count:5 },
    { id: 2 ,count:6 },
    { id: 3 ,count:7 },
    { id: 4 ,count:10},
    { id: 5 ,count:5},
    { id: 6 ,count:6},
    { id: 7 ,count:7},
    { id: 8 ,count:8},
    { id: 9 ,count:9},
    { id: 10 ,count:10},
    { id: 11 ,count:7},
    { id: 12 ,count:8}
  ];

  const heading = "Languages";

  return (
    <>
      <div>
        <h1 className='text-4xl font-bold text-center my-10'>{heading}</h1>
        <div className="lg:grid lg:grid-cols-2 gap-4 p-10 flex flex-col max-h-2/3">
          <div className="bg-[#ebe7de5b] w-11/12 mx-auto rounded-md border shadow-lg p-2">
            <div className='grid grid-cols-2 gap-4'>
              <div className='w-11/12 mx-auto'>
                <p className='bg-[#e4e2e2] text-2xl text-center rounded-md'>Topics</p>
                <div className='flex flex-col md:space-y-12 space-y-8 mt-10 '>
                  {topics.map((topic) => (
                    <Link key={topic.index} to={topic.path} className="text-xl text-center">
                      {topic.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div className=''>
                <p className='bg-[#e4e2e2] text-2xl text-center rounded-md'>Badges</p>
                <div className='flex flex-col md:space-y-12 space-y-8 mt-10'>
                  {badges.map((badge) => (
                    <div key={badge.id} className='mx-auto flex'>
                      <p className='text-xl'>{badge.count} of 10</p>
                      <ImFire className='text-xl  ml-2'/>
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

            <div className={`hidden md:grid md:grid-cols-2 md:gap-8 md:mt-8 lg:mt-8`}>
              <Progress progress={progress} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Languages;