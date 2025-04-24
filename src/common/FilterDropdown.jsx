import React from "react";
import Select from "react-select";
import { ReactComponent as DownArrow } from "../assets/images/Down Arrow.svg"; // Import DownArrow

const FilterDropdown = ({ filterValue, onFilterChange, options, placeholder, className,valueKey,  // Default key for value
  labelKey = "organizationType" }) => {
  // Custom styles directly in the component
  console.log(options,"from zzzzzzzzzzzzz")
  const customStyles = {
    control: (base, { isFocused }) => ({
      ...base,
      border: isFocused ? "2px solid #660F5D" : "1px solid #EAEAFF",
      boxShadow: isFocused ? 'none' : '0px 0px 4px 1px #00000033',
      borderRadius: "5px",
      padding: "2px",
      fontSize: "12px", // Consistent font size
      color: "#757575",
      height: "42px",
      "&:hover": {},
    }),
    placeholder: (base) => ({
      ...base,
      color: "#131313",
      fontWeight: 600,
      fontSize: "12px",
    }),
    singleValue: (base) => ({
      ...base,
      fontSize: "12px",
      fontWeight: "600",
      color: "#131313",
      fontFamily: "Montserrat, sans-serif",
    }),
    option: (base) => ({
      ...base,
      backgroundColor: "white",
      color: "#757575",
      fontWeight: "600",
      cursor: "pointer",
      fontSize: "12px",
      "&:hover": {
        backgroundColor: "#660F5D",
        color: "white",
      },
    }),
    menu: (base) => ({
      ...base,
      width: "150px", // Fixed dropdown menu width
    }),
  };

  // Transform options into React Select's format
    const formattedOptions = [
    { value: "all", label: "All" },  // Add "All" at the beginning
    ...(Array.isArray(options)
      ? options.map((option) => ({
        value: option.value, 
        label: option.label, 
        }))
      : [])
  ];

  return (
    <div className="relative w-full">
      <Select
        value={
          filterValue
            ? formattedOptions.find((opt) => opt.value === filterValue)
            : { value: "", label: placeholder, isDisabled: true }
        }
        onChange={(selectedOption) => onFilterChange(selectedOption?.value)}
        options={formattedOptions}
        placeholder={placeholder}
        className={className}
        styles={customStyles} // Apply custom styles directly
        components={{
          DropdownIndicator: () => null, // Hide default arrow
          IndicatorSeparator: () => null,
        }}
      />
      
      {/* Custom DownArrow inside the field */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <DownArrow className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
};

export default FilterDropdown;
