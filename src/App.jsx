import React from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Frontend from './pages/Topics/Frontend.jsx';
import Languages from './pages/Topics/Languages.jsx';
import Backend from './pages/Topics/Backend.jsx';
import Topic from './components/Topic.jsx';
import Content from './components/Content.jsx';
import GenerateContent from './components/GenerateContent.jsx';
import NotFound from './pages/NotFound.jsx';

const App = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col"> 
        <Navbar />

        <div className="flex-grow">

          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/languages" element={<Languages />} />
            <Route path="/frontend" element={<Frontend />} />
            <Route path="/backend" element={<Backend />} />
            <Route path="/topics/:subject" element={<Topic />} />
            <Route path="/content/:subject/:topic" element={<Content />} />
            <Route path="/generate-content" element={<GenerateContent />} />
            <Route path="*" element={<NotFound />} />

          </Routes>

          
        </div>

        <footer className="py-3">
          <div className="container mx-auto text-center">
            <p>&copy; 2024 SkillForge. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;