import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthService";
import { getBadges } from "../services/contentService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const { setIsAuthenticated, isAuthenticated } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log({ email, password });
    // console.log(isAuthenticated);

    axios
      .post("http://localhost:3000/api/login", { email, password })
      .then(async (response) => {
        // console.log(response);
        localStorage.setItem("token", response.data.token);
        setIsAuthenticated(true);
        // console.log(isAuthenticated);
        // window.location.href = "/dashboard";
      })
      .catch((error) => {
        // console.log(error.message);
        let msg = (error?.response) ?  error.response.data.message : error.message;
        toast.error(msg);
      });
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
        {/* <div className="flex items-start mb-5">
          <div className="flex items-center h-5">
            <input
              id="remember"
              type="checkbox"
              className="w-4 h-4 border text-black border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-black"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
          </div>
          <label
            for="terms"
            class="ms-2 text-sm font-medium text-gray-900"
          >
            I agree with the{" "}
            <a
              href="#"
              class="text-blue-600 hover:underline"
            >
              terms and conditions
            </a>
          </label>
        </div> */}
        <button
          type="submit"
          className="w-full bg-black text-white hover:bg-[#5e5e5e] focus:outline-none font-semibold rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Login
        </button>
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
