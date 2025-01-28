import React from "react";
import FilterDropdown from "./FilterDropdown"; // Import the reusable filter component
import Select from "react-select"; // Import react-select
import { ReactComponent as Searchicon } from "../assets/images/search_normal.svg"; // Import the search icon
import { ReactComponent as DownArrow } from "../assets/images/Down Arrow.svg";

const Pagetitle = ({
  title,
  buttonLabel,
  onButtonClick,
  filterValue,
  onFilterChange,
  options,
  searchPlaceholder,
  onSearch,
  filterPlaceholder,
  showRoleAssign,
  roleValue,
  onRoleChange,
  roleOptions,
  assignButtonLabel,
  onAssignClick,
}) => {
  // Custom styles for react-select
  const customStyles = {
    control: (base, state) => ({
      ...base,
      border: state.isFocused ? "2px solid #660F5D" : "1px solid #EAEAFF",
      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      borderRadius: "5px",
      padding: "2px",
      fontSize: "12px",
      color: "#757575",
      "&:hover": {
        borderColor: "none",
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: "#757575",
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

  return (
    <div className="flex flex-col md:flex-row justify-between items-center p-2 space-y-4 md:space-y-0 pl-5">
      {/* Title Section */}
      <div className="font-[700px] text-left w-full md:w-auto">
        <h3 className="font-semibold text-[16px] md:text-[20px]">{title}</h3>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
        {/* Conditionally render Role and Assign Button */}
        {showRoleAssign && (
          <div className="flex items-center space-x-4">
            {/* Role Dropdown */}
            <div className="relative w-[200px]">
              <Select
                value={roleOptions.find((role) => role.value === roleValue)}
                onChange={(selectedOption) => onRoleChange(selectedOption.value)}
                options={roleOptions}
                placeholder="Select Role"
                styles={customStyles}
                components={{
                  DropdownIndicator: () => (
                    <DownArrow className="w-[16px] h-[16px] pr-1" />
                  ),
                  IndicatorSeparator: () => null,
                }}
              />
            </div>

            {/* Assign Button */}
            <button
              onClick={onAssignClick}
              className="bg-[#660F5D] text-white px-4 py-2 rounded-lg flex items-center justify-center h-[40px] text-[12px]"
            >
              {assignButtonLabel || "Assign"}
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative w-full searchbar sm:w-[250px]">
          <input
            type="text"
            className="p-2 border searchbar rounded w-full h-[40px] text-[12px] shadow-md pr-10 focus:border-2 focus:ring-[#660F5D] focus:border-[#660F5D] focus:outline-none"
            placeholder={searchPlaceholder || "Search"}
            onChange={onSearch}
          />
          <Searchicon className="absolute right-3 top-1/2 transform -translate-y-1/2" />
        </div>

        {/* Filter Dropdown with Custom Down Arrow */}
        <div className="relative w-[100px]">
          <FilterDropdown
            filterValue={filterValue}
            onFilterChange={onFilterChange}
            options={options}
            placeholder={filterPlaceholder}
            customStyles={customStyles}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <DownArrow className="text-gray-400" />
          </div>
        </div>

        {/* Create Button */}
        <button
          onClick={onButtonClick}
          className="bg-[#660F5D] text-white px-2 py-2 rounded-lg flex items-center justify-center h-[40px] text-[12px] w-full sm:w-auto"
        >
          <span className="mr-2">+</span> {buttonLabel || "Create"}
        </button>
      </div>
    </div>
  );
};

export default Pagetitle;
