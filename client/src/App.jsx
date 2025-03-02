import React from "react";
import Navbar from "./components/Navbar/Navbar";
import LandingPage from "./pages/LandingPage";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Frontend from "./pages/Topics/Frontend.jsx";
import Languages from "./pages/Topics/Languages.jsx";
import Backend from "./pages/Topics/Backend.jsx";
import Topic from "./components/Topic/Topic";
import Content from "./components/Content/Content";
import GenerateContent from "./components/GenerateContent/GenerateContent";
import NotFound from "./pages/NotFound.jsx";
import Carousel from "./components/Carousel/Carousel";
import Progress from "./components/Progress/Progress";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "./services/AuthService";
import CodeEditor from "./pages/CodeEditor.jsx";
import Settings from "./pages/Settings.jsx";
import SetPassword from "./pages/SetPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <div className="min-h-[100vh] flex flex-col">
        {isAuthenticated && <Navbar />}

        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick={true}
          rtl={false}
          draggable
          pauseOnHover
          theme="light"
        />

        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute condition={true}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/languages"
              element={
                <ProtectedRoute condition={true}>
                  <Languages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/frontend"
              element={
                <ProtectedRoute condition={true}>
                  <Frontend />
                </ProtectedRoute>
              }
            />
            <Route
              path="/backend"
              element={
                <ProtectedRoute condition={true}>
                  <Backend />
                </ProtectedRoute>
              }
            />
            <Route
              path="/topics/:subject"
              element={
                <ProtectedRoute condition={true}>
                  <Topic />
                </ProtectedRoute>
              }
            />
            <Route
              path="/content/:subject/:topic/:id/:content"
              element={
                <ProtectedRoute condition={true}>
                  <Content />
                </ProtectedRoute>
              }
            />
            <Route
              path="/generate-content"
              element={
                <ProtectedRoute condition={true}>
                  <GenerateContent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <ProtectedRoute condition={false}>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <ProtectedRoute condition={false}>
                  <Signup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/codePlay"
              element={
                <ProtectedRoute condition={true}>
                  <CodeEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute condition={true}>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/setPassword/:token"
              element={
                <ProtectedRoute condition={false}>
                  <SetPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resetPassword"
              element={
                <ProtectedRoute condition={false}>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        {isAuthenticated && (
          <footer
            className="bg-gray-100 shadow-xl border-t"
          >
            <div className="container mx-auto text-center text-sm ">
              <p>&copy; 2025 SkillForge. All rights reserved.</p>
            </div>
          </footer>
        )}
      </div>
    </>
  );
};

export default App;
