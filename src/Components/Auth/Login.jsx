import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import axios from "axios"; // Import axios for API calls
import './Login.css'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const [error, setError] = useState(""); // State for error messages
  const navigate = useNavigate(); // Hook to navigate programmatically

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from reloading the page

    try {
      const response = await axios.post("http://localhost:5000/api/admin/login", { email, password });
      // If login is successful, store the token and navigate to the dashboard
      localStorage.setItem("token", response.data.token); // Save token in localStorage
      navigate("/organizationlist"); 
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong"); // Show error message
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center justify-center flex-grow">
        <div className="w-full max-w-sm px-4">
          <div className="flex justify-center mb-4">
            <img
              src="/assets/images/logo2.png"
              alt="Logo"
              className="w-22 h-20"
            />
          </div>
          <h3 className="text-xl text-[#131313] font-extrabold mb-6 text-center">
            Login with Email
          </h3>
          {error && (
            <div className="mb-4 text-red-500 text-sm text-center">
              {error} {/* Display error message */}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-[#131313] text-sm font-bold mb-[12px]"
              >
                Email
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#860579]">
                <span className="px-3 emailicon border-none">
                  <Icon icon="material-symbols-light:mail-outline" width={20} />
                </span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Set email value
                  className="w-full email py-3 px-0 text-[12px] text-black focus:outline-none focus:ring-0 focus:border-none"
                  placeholder="eg : platix@gmail.com"
                />
              </div>
            </div>
            {/* Password Field */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm text-[#131313] font-bold mb-[12px]"
              >
                Password
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#860579]">
                <span className="px-3 passwordicon  border-none">
                  <Icon icon="solar:lock-password-unlocked-outline" width={20} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Set password value
                  className="w-full password py-3 px-0 text-[12px] focus:outline-none focus:ring-0 focus:border-none"
                  placeholder="password"
                />
                <span
                  className="px-3 text-gray-500 cursor-pointer border-none"
                  onClick={togglePasswordVisibility}
                >
                  <Icon
                    icon={showPassword ? "mdi:eye" : "mdi:eye-off"}
                    width={20}
                  />
                </span>
              </div>
              <h4 className="text-[12px] text-[#131313] text-right mt-1 cursor-pointer font-semibold">
                <Link to="/forgotpass">Forgot Password?</Link> {/* Add Link */}
              </h4>
            </div>
            {/* Login Button */}
            <div className="mt-[32px]">
              <button
                type="submit"
                className="w-full py-3 bg-[#860579] text-white font-semibold rounded-lg hover:bg-[#860579] focus:outline-none focus:ring focus:ring-[#860579]"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Copyright Text */}
      <div className="flex justify-center py-4 mt-auto bg-white">
        <h4 className="text-sm text-[#131313]">© Copyright 2025 Platix Admin portal</h4>
      </div>
    </div>
  );
};

export default Login;
