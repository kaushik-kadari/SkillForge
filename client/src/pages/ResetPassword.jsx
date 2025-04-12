import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEmail('');

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const url = import.meta.env.VITE_serverUrl;

    try {
      const response = await axios.post(url + 'reset-password', { email });
      toast.success(response.data.message, { autoClose: 2000 });
      await sleep(3000);
      navigate('/login');
    } catch (error) {
      let msg = (error?.response) ?  error.response.data.message : error.message;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-[#f7f5ef92] sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">Forgot Password</h2>
          <p className="mt-2 text-sm text-center text-gray-600">
            Enter your email to reset your password
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full px-3 py-2 border-1 shadow-lg border-b-2 border-gray-300 text-gray-900 placeholder-gray-500 rounded-md focus:outline-none focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="relative flex justify-center w-full px-4 py-2 text-sm font-semibold text-white bg-black border border-transparent rounded-md group hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 "
            >
              {loading ? 'Sending...' : 'Send Reset Email'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
