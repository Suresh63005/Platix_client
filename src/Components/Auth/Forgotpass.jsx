import React from 'react';
import { Icon } from '@iconify/react';

const Forgotpass = () => {
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
          <form>
            
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

            
            <div className="mt-[32px]">
              <button
                type="submit"
                className="w-full py-2 bg-[#860579] text-white font-semibold rounded-lg hover:bg-[#860579] focus:outline-none focus:ring focus:ring-[#860579]"
              >
                Send
              </button>
              <div className="text-center mt-2">
                <span className="text-[#860579] text-[12px]">Didn't get link? </span>
                <span className="text-black font-semibold cursor-pointer text-[12px]">
                  Resend
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <div className="flex justify-center py-4 mt-auto bg-white">
        <h4 className="text-sm text-[#131313]">© Copyright 2025 Platix Admin portal</h4>
      </div>
    </div>
  );
};

export default Forgotpass;
