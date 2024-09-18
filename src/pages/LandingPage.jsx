import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-[#ebdfc53c]">

      {/* Hero Section */}
      <section className="text-white bg-gradient-to-bl from-[#e9defa] to-[#fbfcdb] py-20 h-screen flex justify-center items-center ">
        <div className="container mx-auto text-center ">
          <h2 className="text-6xl font-semibold text-black">Master Your Desired Tech Stack</h2>
          <p className="mt-4 text-xl text-black">Self-paced learning paths for Frontend, Backend, Machine Learning, and Aptitude.</p>
          <button 
              className="mt-6 px-8 py-3 bg-white text-black font-semibold rounded hover:bg-black hover:text-white transition-all"
              onClick={() => navigate('/dashboard')}>
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-6 py-20 mx-auto ">
        <h3 className="text-2xl font-semibold text-center text-gray-800">Explore Our Learning Paths</h3>
        <div className="grid grid-cols-1 gap-8 mt-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Languages */}
          <div className="p-6 md:hidden text-center transition-all bg-white rounded shadow-md cursor-pointer md: mp-6 hover:shadow-lg">
            <h4 className="text-xl font-bold text-gray-800">Languages</h4>
            <p className="mt-4 text-gray-600">
              Learn the fundamentals of programming languages like C, C++, Java, and Python.
            </p>
          </div>
          {/* Frontend */}
          <div className="p-6 text-center transition-all bg-white rounded shadow-md cursor-pointer hover:shadow-xl">
            <h4 className="text-xl font-bold text-gray-800">Frontend Development</h4>
            <p className="mt-4 text-gray-600">
              Learn HTML, CSS, JavaScript, React, and more to create stunning user interfaces and web applications.
            </p>
          </div>
          {/* Backend */}
          <div className="p-6 text-center transition-all bg-white rounded shadow-md cursor-pointer hover:shadow-xl">
            <h4 className="text-xl font-bold text-gray-800">Backend Development</h4>
            <p className="mt-4 text-gray-600">
              Master server-side technologies like Node.js, Python, databases, and API development.
            </p>
          </div>
          {/* Machine Learning */}
          <div className="p-6 text-center transition-all bg-white rounded shadow-md cursor-pointer hover:shadow-xl">
            <h4 className="text-xl font-bold text-gray-800">Machine Learning</h4>
            <p className="mt-4 text-gray-600">
              Dive into data science, algorithms, and Python to build intelligent systems and models.
            </p>
          </div>
          {/* Aptitude */}
          <div className="p-6 text-center transition-all bg-white rounded shadow-md cursor-pointer hover:shadow-xl">
            <h4 className="text-xl font-bold text-gray-800">Aptitude</h4>
            <p className="mt-4 text-gray-600">
              Sharpen your logical reasoning, quantitative skills, and problem-solving abilities.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-12 text-white bg-gradient-to-bl from-[#e9defa] to-[#fbfcdb]">
        <div className="container mx-auto text-center">
          <h4 className="text-3xl font-semibold text-black">Start Your Learning Journey Today</h4>
          <p className="mt-4 text-lg text-black">Sign up now and take the first step towards mastering your chosen tech stack.</p>
          <button className="mt-6 px-8 py-3 bg-white text-black font-semibold rounded hover:bg-black hover:text-white transition-all">Sign Up</button>
        </div>
      </section>

      {/* Footer Section */}
      {/* <footer className="py-2 text-black">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 SkillForge. All rights reserved.</p>
        </div>
      </footer> */}
    </div>
  );
};

export default LandingPage;
