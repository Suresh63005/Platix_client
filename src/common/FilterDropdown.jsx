import React from "react";

const FilterDropdown = ({ filterValue, onFilterChange, options, placeholder, className }) => {
  return (
    <select
      value={filterValue}
      onChange={(e) => onFilterChange(e.target.value)}
      className={`p-2 border rounded-lg ${className} bg-white w-full sm:w-auto`} // Make the dropdown full-width on smaller screens
    >
      {/* Placeholder with gray color */}
      <option value="" disabled className="text-gray-400">
        {placeholder || "Select..."} {/* Default placeholder with gray color */}
      </option>
      
      {/* Options with hover and active states */}
      {options.map((option, index) => (
        <option
          key={index}
          value={option}
          className="bg-white text-black hover:bg-[#660F5D] hover:text-white focus:bg-[#660F5D] focus:text-white"
        >
          {option} {/* Option background color set to #660F5D with white text on hover/focus */}
        </option>
      ))}
    </select>
  );
};

export default FilterDropdown;
