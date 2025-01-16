import React from "react";

const FilterDropdown = ({ filterValue, onFilterChange, options, placeholder, className }) => {
  return (
    <select
      value={filterValue}
      onChange={onFilterChange}  // Ensure this triggers the event correctly
      className={className}
    >
      <option value="">{placeholder}</option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default FilterDropdown;
