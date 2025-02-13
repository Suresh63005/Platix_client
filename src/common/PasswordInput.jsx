import React, { useState } from "react";
import { Icon } from "@iconify/react";

const PasswordInput = React.forwardRef(({ label, placeholder, value, ...rest }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="block text-[black] text-[12px] font-sm mb-[4px]">
        {label+"*"}
      </label>
      <div className="flex items-center border border-gray-300 rounded-lg focus-within:border-[#660F5D] relative">
        <input
          ref={ref}
          type={showPassword ? "text" : "password"}
          className="w-full rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D] font-medium"
          placeholder={placeholder}
          value={value} // Now correctly controlled
          {...rest} // Ensures name and onChange are applied
        />
        <span
          className="px-3 text-gray-500 cursor-pointer absolute right-[10px]"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          <Icon icon={showPassword ? "mdi:eye" : "mdi:eye-off"} width={20} />
        </span>
      </div>
    </div>
  );
});

export default PasswordInput;