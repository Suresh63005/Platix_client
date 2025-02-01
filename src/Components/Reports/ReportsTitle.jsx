import React from "react";
import { useForm } from "react-hook-form"; // Import useForm hook
import { ReactComponent as Searchicon } from "../../assets/images/search_normal.svg"; // Import the search icon
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
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    // handle form submission if needed
    console.log(data);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center p-4 space-y-4 md:space-y-0">
      {/* Title Section */}
      <div className="font-medium text-left w-full md:w-auto">
        <h3 className="font-semibold text-[16px] md:text-[20px]">{title}</h3>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
        {/* Date Range Inputs */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex space-x-4">
          {/* From Date Input */}
          <div className="relative w-full sm:w-[150px]">
            <label className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-[14px]">
              From
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={onFromDateChange}

              {...register("fromDate", { required: "From Date is required" })}
              className="p-2 pl-12  w-full border border-[#EAEAFF] font-medium focus:outline-none focus:ring-2 focus-visible:ring-[#660F5D] rounded-md text-[12px] h-[42px]  text-[#757575] font-['Montserrat', sans-serif]"
            />

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

              {...register("toDate", { required: "To Date is required" })}
              className="p-2 pl-12  w-full border border-[#EAEAFF] font-medium focus:outline-none focus:ring-2 focus-visible:ring-[#660F5D] rounded-md text-[12px] h-[42px]  text-[#757575] font-['Montserrat', sans-serif]"
            />

          </div>
        </form>

        {/* Search Bar */}
        <div className="relative w-full sm:w-[250px]"> {/* Responsive width */}
          <input
            type="text"
            className="p-2 border border-[#EAE5FF] searchbar-w rounded w-full h-[40px] text-[12px] shadow-[ 0px 0px 4px 1px #00000033] pr-10 focus:border-2 focus:ring-[#660F5D] focus:border-[#660F5D] focus:outline-none"
            
            placeholder={searchPlaceholder || "Search"}
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
