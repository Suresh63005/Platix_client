import React from "react";
import FilterDropdown from "./FilterDropdown"; // Import the reusable filter component
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
  filterPlaceholder, // Added prop for filter placeholder
  showRoleAssign, // Show role and assign button
  roleValue,
  onRoleChange,
  roleOptions,
  assignButtonLabel,
  onAssignClick,
}) => {
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
            <div className="relative w-[200px]">
              <select
                value={roleValue}  // Controlled value for the select dropdown
                onChange={(e) => onRoleChange(e.target.value)}  // Update state on change
                className="p-2 pl-2 border rounded w-full h-[40px] text-[12px] shadow-md focus:border-2 focus:ring-[#660F5D] focus:border-[#660F5D] focus:outline-none"
              >
                <option value="" disabled>Select Role</option>  {/* Placeholder */}
                {roleOptions?.map((role, index) => (
                  <option key={index} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onAssignClick}
              className="bg-[#660F5D] text-white px-4 py-2 rounded-lg flex items-center justify-center h-[40px] text-[14px]"
            >
              {assignButtonLabel || "Assign"}
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative w-full searchbar sm:w-[250px]">
          <input
            type="text"
            className="p-2 border rounded w-full h-[40px] text-[12px] shadow-md pr-10 focus:border-2 focus:ring-[#660F5D] focus:border-[#660F5D] focus:outline-none"
            placeholder={searchPlaceholder || "Search..."}
            onChange={onSearch}  // Trigger search handler
          />
          <Searchicon className="absolute right-3 top-1/2 transform -translate-y-1/2" />
        </div>

        {/* Filter Dropdown with Custom Down Arrow */}
        <div className="relative w-[100px]">
          <FilterDropdown
            filterValue={filterValue}
            onFilterChange={onFilterChange}
            options={options}
            placeholder={filterPlaceholder} // Use placeholder as required
            className="appearance-none p-2 pl-2 border filter rounded w-full h-[40px] text-[12px] shadow-md focus:border-2 focus:ring-[#660F5D] overflow-hidden focus:border-[#660F5D] focus:outline-none"
          />
          <DownArrow className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
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
