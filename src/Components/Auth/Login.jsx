import React, { useState } from "react";
import { Icon } from "@iconify/react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center justify-center flex-grow">
        <div className="w-full max-w-sm px-4">
          <div className="flex justify-center mb-4">
            <img
              src="/assets/images/Frame 427319709.png"
              alt="Logo"
              className="w-22 h-20"
            />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
            Login with phone number
          </h3>
          <form>
            {/* Email Field */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-[12px]"
              >
                Email
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#860579]">
                <span className="px-3 text-gray-500 border-none">
                  <Icon icon="material-symbols-light:mail-outline" width={20} />
                </span>
                <input
                  type="email"
                  id="email"
                  className="w-full py-2 px-0 text-[14px] focus:outline-none focus:ring-0 focus:border-none"
                  placeholder="eg : platix@gmail.com"
                />
              </div>
            </div>
            {/* Password Field */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-[12px]"
              >
                Password
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#860579]">
                <span className="px-3 text-gray-500 border-none">
                  <Icon icon="solar:lock-password-unlocked-outline" width={20} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full py-2 px-0 text-[14px] focus:outline-none focus:ring-0 focus:border-none"
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
              <h4 className="text-sm text-[#131313] text-right mt-1 cursor-pointer font-medium">
                Forgot Password?
              </h4>
            </div>
            {/* Login Button */}
            <div className="mt-[32px]">
              <button
                type="submit"
                className="w-full py-2 bg-[#860579] text-white font-semibold rounded-lg hover:bg-[#860579] focus:outline-none focus:ring focus:ring-[#860579]"
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
