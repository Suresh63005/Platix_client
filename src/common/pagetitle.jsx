import React from "react";
import FilterDropdown from "./FilterDropdown"; // Import the reusable filter component
import { ReactComponent as Searchicon } from "../assets/images/search_normal.svg"; // Import the search icon

const Pagetitle = ({
  title,
  buttonLabel,
  onButtonClick,
  filterValue,
  onFilterChange,
  options,
  searchPlaceholder,
  onSearch,
  showRoleAssign, // Conditional prop to show Select Role and Assign Button
  roleValue,
  onRoleChange,
  roleOptions,
  assignButtonLabel,
  onAssignClick,
  filterPlaceholder, // Added prop for filter placeholder
  selectPlaceholder, // Added prop for select placeholder
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center p-4 space-y-4 md:space-y-0">
      {/* Title Section */}
      <div className="font-medium text-left w-full md:w-auto">
        <h3 className="font-semibold text-[16px] md:text-[20px]">{title}</h3>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
        {/* Conditional Role Dropdown and Assign Button */}
        {showRoleAssign && (
          <>
            {/* Select Role Dropdown */}
            <FilterDropdown
              filterValue={roleValue}
              onFilterChange={onRoleChange}
              options={roleOptions}
              placeholder={selectPlaceholder} // Pass placeholder for role dropdown
              className="w-full sm:w-[200px]" // Responsive width
            />
            {/* Assign Button */}
            <button
              onClick={onAssignClick}
              className="bg-[#660F5D] text-white px-4 py-2 rounded flex items-center justify-center h-[40px] text-[14px] w-full sm:w-auto"
            >
              {assignButtonLabel || "Assign"}
            </button>
          </>
        )}

        {/* Search Bar */}
        <div className="relative w-full sm:w-[250px]"> {/* Responsive width */}
          <input
            type="text"
            className="p-2 border rounded w-full h-[40px] text-[14px] shadow-md pr-10"
            placeholder={searchPlaceholder || "Search..."}
            onChange={onSearch}
          />
          <Searchicon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Filter Dropdown */}
        <FilterDropdown
          filterValue={filterValue}
          onFilterChange={onFilterChange}
          options={options}
          placeholder={filterPlaceholder} // Pass placeholder for filter dropdown
          className="w-full sm:w-[100px]" // Responsive width
        />

        {/* Create Button */}
        <button
          onClick={onButtonClick}
          className="bg-[#660F5D] text-white px-4 py-2 rounded flex items-center justify-center h-[40px] text-[14px] w-full sm:w-auto"
        >
          <span className="mr-2">+</span> {buttonLabel || "Create"}
        </button>
      </div>
    </div>
  );
};

export default Pagetitle;
