import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";
import axios from "axios";

const Createnewpass = () => {
  const { register, handleSubmit, watch, setError, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setErrorState] = useState("");

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const onSubmit = async (data) => {
    const { newPassword, confirmPassword } = data;

    if (newPassword !== confirmPassword) {
      setError("confirmPassword", { message: "Passwords do not match" });
      return;
    }

    try {
      const token = new URLSearchParams(window.location.search).get("token");

      if (!token) {
        setErrorState("Token is missing. Please use the link sent to your email.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/createnewpass",
        { newPassword, confirmPassword },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Password updated successfully!");
      setErrorState("");
    } catch (error) {
      if (error.response?.status === 400) {
        setErrorState(error.response.data || "Invalid or expired token.");
      } else if (error.response?.status === 404) {
        setErrorState("User not found.");
      } else {
        setErrorState("Server error. Please try again later.");
      }
      setSuccess("");
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

          <h3 className="text-xl font-bold text-gray-800 mb-[12px] text-center">
            Create Your New Password
          </h3>
          <h4 className="text-center text-[#860579] text-[12px] mb-6">
            Set your new password here
          </h4>

          {/* Show success or error messages */}
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {success && <div className="text-green-500 mb-4">{success}</div>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#860579]">
                <span className="px-3 text-gray-500">
                  <Icon icon="solar:lock-password-unlocked-outline" width={20} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full py-2 px-0 text-[14px] focus:outline-none focus:ring-0"
                  placeholder="Create password"
                  {...register("newPassword", { required: "Password is required" })}
                />
                <span
                  className="px-3 text-gray-500 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  <Icon
                    icon={showPassword ? "mdi:eye" : "mdi:eye-off"}
                    width={20}
                  />
                </span>
              </div>
              {errors.newPassword && <span className="text-red-500">{errors.newPassword.message}</span>}
            </div>

            <div className="mb-4">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#860579]">
                <span className="px-3 text-gray-500">
                  <Icon icon="solar:lock-password-unlocked-outline" width={20} />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full py-2 px-0 text-[14px] focus:outline-none focus:ring-0"
                  placeholder="Re-enter password"
                  {...register("confirmPassword", { required: "Please confirm your password" })}
                />
                <span
                  className="px-3 text-gray-500 cursor-pointer"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  <Icon
                    icon={showConfirmPassword ? "mdi:eye" : "mdi:eye-off"}
                    width={20}
                  />
                </span>
              </div>
              {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword.message}</span>}
            </div>

            <div className="mt-[32px]">
              <button
                type="submit"
                className="w-full py-2 bg-[#860579] text-white font-semibold rounded-lg hover:bg-[#860579] focus:outline-none"
              >
                Submit
              </button>
              <div className="mt-3 text-center text-sm">
                <span className="text-[#860579] text-[12px]">Didn't get a link?</span>{" "}
                <button className="text-black font-semibold focus:outline-none text-[12px]">
                  Re-send
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="flex justify-center py-4 mt-auto bg-white">
        <h4 className="text-sm text-[#131313]">
          © Copyright 2025 Platix Admin portal
        </h4>
      </div>
    </div>
  );
};

export default Createnewpass;
