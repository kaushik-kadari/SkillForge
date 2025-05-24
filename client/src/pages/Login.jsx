import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useAuth } from "../services/AuthService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAuthenticated } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    const url = import.meta.env.VITE_serverUrl;

    try {
      const response = await axios.post(url + "login", { email, password });
      localStorage.setItem("token", response.data.token);
      setIsAuthenticated(true);
      // window.location.href = "/dashboard";
    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#f7f5ef92]">
      <img src="Logo.png" alt="" className="h-20 mb-4" />
      <form className="w-full transition-all max-w-md rounded-md shadow-lg p-6 bg-white border" onSubmit={handleSubmit}>
        <div className="mb-5">  
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-semibold text-gray-900"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="shadow-sm bg-gray-50 border-0 border-b-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-semibold text-gray-900"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="shadow-sm bg-gray-50 border-0 border-b-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-black text-white ${!isLoading ? 'hover:bg-[#5e5e5e]' : 'opacity-70 cursor-not-allowed'} focus:outline-none font-semibold rounded-lg text-sm px-5 py-2.5 text-center transition-opacity`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </div>
          ) : (
            'Login'
          )}
        </button>
        <p className="text-sm text-center font-light text-red-500 mt-3">
          <Link
            to="/resetPassword"
            className="font-medium hover:underline"
          >
            Forgot password?
          </Link>
        </p>
        <p className="text-sm text-center font-light text-gray-500 mt-3">
          Don’t have an account yet?{" "}
          <Link
            to="/signup"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
