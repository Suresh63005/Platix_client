import React from "react";
import Select from "react-select";

const FilterDropdown = ({ filterValue, onFilterChange, options, placeholder, customStyles }) => {
  // Transform options into React Select's required format
  const formattedOptions = options.map((option) => ({
    value: option,
    label: option,
  }));

  // Custom components to hide the default dropdown arrow
  const customComponents = {
    DropdownIndicator: () => null,
    IndicatorSeparator: () => null,
  };

  return (
    <Select
      value={
        filterValue
          ? formattedOptions.find((opt) => opt.value === filterValue) // Set selected option
          : { value: "", label: placeholder, isDisabled: true } // Set placeholder as the selected option
      }
      onChange={(selectedOption) => onFilterChange(selectedOption?.value)} // Trigger value change
      options={formattedOptions} // Dropdown options (placeholder not included here)
      placeholder={placeholder} // Placeholder text
      styles={customStyles} // Custom styles for the dropdown
      components={customComponents} // Custom components to hide the default arrow
      isOptionDisabled={(option) => option.isDisabled} // Disable the placeholder option
    />
  );
};

export default FilterDropdown;
