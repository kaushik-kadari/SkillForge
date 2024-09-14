// import React from 'react';
// import Navbar from './components/Navbar';
// import LandingPage from './pages/LandingPage';
// import { Routes, Route, Link } from 'react-router-dom';
// import Dashboard from './pages/Dashboard';

// const App = () => {
//   return (
//     <>
//       <div className="min-h-screen flex flex-col"> 
//         <Navbar />

//         <Routes>
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//         </Routes>

//         <footer className="py-3 ">
//           <div className="container mx-auto text-center">
//             <p>&copy; 2024 SkillForge. All rights reserved.</p>
//           </div>
//         </footer>
//       </div>
//     </>
//   );
// }
 
// export default App;

import React from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col"> 
        <Navbar />

        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
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
