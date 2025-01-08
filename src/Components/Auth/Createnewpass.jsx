import React, { useState } from "react";
import { Icon } from "@iconify/react";

const Createnewpass = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

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
          <form>
            
            <div className="mb-4">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#860579]">
                <span className="px-3 text-gray-500">
                  <Icon icon="solar:lock-password-unlocked-outline" width={20} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="new-password"
                  className="w-full py-2 px-0 text-[14px] focus:outline-none focus:ring-0 focus:border-none"
                  placeholder="Create password"
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
            </div>
            
            <div className="mb-4">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#860579]">
                <span className="px-3 text-gray-500">
                  <Icon icon="solar:lock-password-unlocked-outline" width={20} />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm-password"
                  className="w-full py-2 px-0 text-[14px] focus:outline-none focus:ring-0 focus:border-none"
                  placeholder="Re-enter password"
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
            </div>
            
            <div className="mt-[32px]">
              <button
                type="submit"
                className="w-full py-2 bg-[#860579] text-white font-semibold rounded-lg hover:bg-[#860579] focus:outline-none focus:ring focus:ring-[#860579]"
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
