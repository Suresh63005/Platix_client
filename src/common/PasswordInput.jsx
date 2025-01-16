import React, { useState } from "react";
import { Icon } from "@iconify/react";

const PasswordInput = ({ label, placeholder, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div>
      <label className="block text-[black] text-[12px] font-sm mb-2">
        {label}
      </label>
      <div className="flex items-center border border-gray-300 rounded-lg focus-within:border-[#660F5D] relative">
        <input
          type={showPassword ? "text" : "password"}
          className="w-full rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D]"
          placeholder={placeholder}
          onChange={onChange}
        />
        <span
          className="px-3 text-gray-500 cursor-pointer absolute right-[10px]"
          onClick={togglePasswordVisibility}
        >
          <Icon icon={showPassword ? "mdi:eye" : "mdi:eye-off"} width={20} />
        </span>
      </div>
    </div>
  );
};

export default PasswordInput;
