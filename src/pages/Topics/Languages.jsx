import React from 'react';
import { HiBadgeCheck } from "react-icons/hi";
import { Link } from 'react-router-dom';
import Carousel from '../../components/Carousel/Carousel.jsx';
import Progress from '../../components/Progress/Progress.jsx';
import { useAuth } from '../../services/AuthService.jsx';

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
    { label: "C" },
    { label: "C++" },
    { label: "C#" },
    { label: "Go" },
    { label: "Java" },
    { label: "JavaScript" },
    { label: "Kotlin" },
    { label: "PHP" },
    { label: "Python" },
    { label: "Ruby" },
    { label: "Swift" },
    { label: "TypeScript" }
  ];
  
  let { badges } = useAuth();
  badges = badges.filter((badge) => badge.id >= 6 && badge.id <= 17);
  // console.log(badges);

  for(let i = 0; i < badges.length; i++) {
    let val = Number.parseInt((badges[i].count / topics[i].count) * 100);
    // console.log(val);
    progress[i].value = val;
  }

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
                    <Link key={topic.path} to={topic.path} className="text-xl text-center">
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