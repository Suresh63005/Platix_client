import React from "react";
import { ReactComponent as Searchicon } from "../../assets/images/search_normal.svg"; // Import the search icon
import { ReactComponent as CalendarIcon } from "../../assets/images/Calender.svg"; // Import the calendar icon
import { ReactComponent as DownloadIcon } from "../../assets/images/tabler_download.svg"; // Import the download icon

const ReportsTitle = ({
  title,
  searchPlaceholder,
  onSearch,
  onDownloadClick,
  filterPlaceholder,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center p-4 space-y-4 md:space-y-0">
      {/* Title Section */}
      <div className="font-medium text-left w-full md:w-auto">
        <h3 className="font-semibold text-[16px] md:text-[20px]">{title}</h3>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
        {/* Date Range Inputs */}
        <div className="flex space-x-4">
          {/* From Date Input */}
          <div className="relative w-full sm:w-[150px]">
            <label className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-[14px]">
              From
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={onFromDateChange}
              className="p-2 pl-12  border rounded w-full h-[40px] text-[14px] shadow-md"
              placeholder="Select Date"
            />
            {/* <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
          </div>
          {/* To Date Input */}
          <div className="relative w-full sm:w-[150px]">
            <label className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-[14px]">
              To
            </label>
            <input
              type="date"
              value={toDate}
              onChange={onToDateChange}
              className="p-2 pl-12  border rounded w-full h-[40px] text-[14px] shadow-md"
              placeholder="Select Date"
            />
            {/* <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
          </div>
        </div>

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

        {/* Download Button */}
        <button
          onClick={onDownloadClick}
          className="bg-[#660F5D] text-white px-4 py-2 rounded flex items-center justify-center h-[40px] text-[14px] w-full sm:w-auto"
        >
          Download
          <DownloadIcon className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default ReportsTitle;
