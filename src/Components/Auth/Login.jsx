import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./Login.css";
import { Vortex } from 'react-loader-spinner';
import { toast, Toaster } from 'react-hot-toast';
import api from "../../utils/api";


const Login = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.post("admin/login", data);
      toast.dismiss();
      toast.success('Login successful!');
      Cookies.set("token", response.data.token, { expires: 1, secure: true, sameSite: "Strict" });

      setTimeout(() => {
        navigate("/organizationlist");
      }, 2000);

    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.error || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center justify-center flex-grow">
        <div className="w-full max-w-sm px-4">
          <div className="flex justify-center mb-4">
            <img src="/assets/images/logo2.png" alt="Logo" className="w-22 h-20" />
          </div>
          <h3 className="text-xl text-[#131313] font-extrabold mb-6 text-center">
            Login with Email
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="font-['poppins', sans-serif]">
            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-[#131313] text-sm font-bold mb-[12px]">
                Email
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#860579]">
                <span className="px-3 emailicon border-none">
                  <Icon icon="material-symbols-light:mail-outline" className="text-[#3030304D]" width={20} />
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  {...register("email")}
                  className="w-full email py-3 px-0 text-[12px] text-black focus:outline-none focus:ring-0 focus:border-none"
                  placeholder="eg : platix@gmail.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm text-[#131313] font-bold mb-[12px]">
                Password
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#860579]">
                <span className="px-3 passwordicon border-none">
                  <Icon icon="solar:lock-password-unlocked-outline" className="text-[#3030304D]" width={20} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  {...register("password")}
                  className="w-full password py-3 px-0 text-[12px] focus:outline-none focus:ring-0 focus:border-none"
                  placeholder="Password"
                />
                <span className="px-3 text-gray-500 cursor-pointer border-none" onClick={togglePasswordVisibility}>
                  <Icon icon={showPassword ? "mdi:eye" : "mdi:eye-off"} width={20} />
                </span>
              </div>
              <h4 className="text-[12px] text-[#131313] text-right mt-1 cursor-pointer font-semibold">
                <Link to="/forgotpass">Forgot Password?</Link>
              </h4>
            </div>

            {/* Login Button */}
            <div className="mt-[32px]">
              <button type="submit" className="w-full py-3 bg-[#860579] text-white font-semibold rounded-lg hover:bg-[#860579] focus:outline-none focus:ring focus:ring-[#860579]" disabled={loading}>
                {loading ? (
                  <Vortex
                    visible={true}
                    height="25"
                    width="350"
                    ariaLabel="vortex-loading"
                    colors={['white', 'white', 'white', 'white', 'white', 'white']}
                  />
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Copyright Text */}
      <div className="flex justify-center py-4 mt-auto bg-white">
        <h4 className="text-sm text-[#25064C] font-medium">© Copyright 2025 Platix Admin Portal</h4>
      </div>
      <Toaster position="top-right" reverseOrder={false} toastOptions={{ duration: 2000 }} />
    </div>
  );
};

export default Login;
