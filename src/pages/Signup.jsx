import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
   
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const formData = {
      name: firstName + " " + lastName,
      email,
      password,
      phone,
      college,
    };

    console.log(formData);

    await axios
      .post("http://localhost:3000/api/signup", formData)
      .then((response) => {
        // console.log(response);
        toast.success(response.data.message, { autoClose: 1000 });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch((error) => {
        // console.log(error);
        let msg = (error?.response) ?  error.response.data.message : error.message;
        toast.error(msg);
      })
      .finally(() => {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setFirstName("");
        setLastName("");
        setPhone("");
        setCollege("");
      });
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#f7f5ef5b]">
      <img src="Logo.png" alt="" className="h-20 mb-4" />
      <form
        className="w-full max-w-md rounded-md shadow-lg p-7 bg-white border"
        onSubmit={handleSubmit}
      >
        <div className="relative z-0 w-full mb-7 group">
          <input
            type="email"
            name="floating_email"
            id="floating_email"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none rounded-md focus:outline-none focus:ring-0 focus:border-black peer"
            placeholder=" "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label
            for="floating_email"
            className="peer-focus:font-medium w-full absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-1 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email address *
          </label>
        </div>
        <div className="relative z-0 w-full mb-7 group">
          <input
            type="password"
            name="floating_password"
            id="floating_password"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none rounded-md focus:outline-none focus:ring-0 focus:border-black peer"
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label
            for="floating_password"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-1 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Password *
          </label>
        </div>
        <div className="relative z-0 w-full mb-7 group">
          <input
            type="password"
            name="repeat_password"
            id="floating_repeat_password"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none rounded-md focus:outline-none focus:ring-0 focus:border-black peer"
            placeholder=" "
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <label
            for="floating_repeat_password"
            className="peer-focus:font-medium w-full absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-1 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Confirm password *
          </label>
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-7 group">
            <input
              type="text"
              name="floating_first_name"
              id="floating_first_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none rounded-md focus:outline-none focus:ring-0 focus:border-black peer"
              placeholder=" "
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <label
              for="floating_first_name"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-1 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              First name *
            </label>
          </div>
          <div className="relative z-0 w-full mb-7 group">
            <input
              type="text"
              name="floating_last_name"
              id="floating_last_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none rounded-md focus:outline-none focus:ring-0 focus:border-black peer"
              placeholder=" "
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <label
              for="floating_last_name"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-1 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Last name
            </label>
          </div>
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-7 group">
            <input
              type="tel"
              pattern="[0-9]{10}"
              name="floating_phone"
              id="floating_phone"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none rounded-md focus:outline-none focus:ring-0 focus:border-black peer"
              placeholder=" "
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <label
              for="floating_phone"
              className="peer-focus:font-medium w-full absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-1 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Phone number
            </label>
          </div>
          <div className="relative z-0 w-full mb-7 group">
            <input
              type="text"
              name="floating_company"
              id="floating_company"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none rounded-md focus:outline-none focus:ring-0 focus:border-black peer"
              placeholder=" "
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              required
            />
            <label
              for="floating_company"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-1 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              College *
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="text-white hover:bg-[#5e5e5e] bg-black  focus:outline-none font-semibold rounded-md text-sm px-5 py-2.5 text-center w-full"
        >
          Signup
        </button>
        <p className="text-sm text-center mt-3 font-light text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
