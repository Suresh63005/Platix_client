import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";  // Import Cookies for storing email
import api from "../../utils/api";

const Forgotpass = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const response = await api.post("admin/forgotpassword", data, {
        withCredentials: true  // Ensure cookies are sent/received
      });

      if (response.status === 200) {
        setSuccess("A password reset link has been sent to your email.");
        setError("");  // Clear previous errors

        // Store email in cookies for later use
        Cookies.set("reset_email", data.email, { expires: 1 });  // Expires in 1 day

        setTimeout(() => {
          navigate("/"); // Redirect after 3 seconds
        }, 3000);
      }
    } catch (err) {
      console.error("Error Response:", err.response?.data || err.message);  // Log full error
      setError(err.response?.data?.message || "Error sending reset link. Please try again."); 
      setSuccess("");  // Clear previous success message
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center justify-center flex-grow">
        <div className="w-full max-w-sm px-4">
          <div className="flex justify-center mb-[16px]">
            <img
              src="/assets/images/Frame 427319709.png"
              alt="Logo"
              className="w-22 h-20"
            />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-[12px] text-center">
            Forgot Password
          </h2>
          <h3 className="text-center text-[#860579] mb-6 text-[12px]">
            Please enter your Registered Email id to send reset link
          </h3>

          {/* Display error or success messages */}
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {success && <div className="text-green-500 mb-4">{success}</div>}

          {/* Form for email input */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-[12px]"
              >
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
                  className="w-full py-3 email px-0 text-[14px] focus:outline-none focus:ring-0 focus:border-none"
                  placeholder="eg: platix@gmail.com"
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>

            <div className="mt-[32px]">
              <button
                type="submit"
                className="w-full py-2 bg-[#860579] text-white font-semibold rounded-lg hover:bg-[#860579] focus:outline-none focus:ring focus:ring-[#860579]"
              >
                Send
              </button>
              <div className="text-center mt-2">
                <span className="text-[#860579] text-[12px]">Didn't get the link? </span>
                <span className="text-black font-semibold cursor-pointer text-[12px]">
                  Resend
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="flex justify-center py-4 mt-auto bg-white">
        <h4 className="text-sm text-[#25064C] font-medium ">© Copyright 2025 Platix Admin portal</h4>
      </div>
    </div>
  );
};

export default Forgotpass;
