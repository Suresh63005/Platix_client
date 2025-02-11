import React from "react";
import Select from "react-select";
import { ReactComponent as DownArrow } from "../assets/images/Down Arrow.svg"; // Import DownArrow

const SelectRoleDropdown = ({ roleValue, onRoleChange, roleOptions, placeholder, customStyles,setOrganizationType_id }) => {
  // Transform options into React Select's format

  
  const formattedOptions = roleOptions.map((option) => ({
    value: option.value,
    label: option.label,
  }));

  console.log(formattedOptions,"from sureshhhhhhhhhhhhhh")

  return (
    <div className="relative w-full">
      <Select
        value={roleValue}
        onChange={(selectedOption) =>{
           onRoleChange(selectedOption?.value)
           setOrganizationType_id(selectedOption?.value);
          }}
        options={formattedOptions}
        placeholder={placeholder}
        styles={customStyles}
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

export default SelectRoleDropdown;
