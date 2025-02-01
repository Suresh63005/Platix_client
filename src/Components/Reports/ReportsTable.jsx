import React, { useState } from "react";
import { ReactComponent as Download } from "../../assets/images/Download.svg";
import { ReactComponent as LeftArrow } from "../../assets/images/Left Arrow.svg";
import { ReactComponent as RightArrow } from "../../assets/images/Right Arrow.svg";

const ReportsTable = ({ columns, data, columnKeyMapping }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allItems = paginatedData.map((item) => item.id);
      setSelectedItems((prev) => [...new Set([...prev, ...allItems])]);
    } else {
      const remainingItems = selectedItems.filter(
        (id) => !paginatedData.some((item) => item.id === id)
      );
      setSelectedItems(remainingItems);
    }
  };

  const handleSelectItem = (event, itemId) => {
    if (event.target.checked) {
      setSelectedItems((prevState) => [...prevState, itemId]);
    } else {
      setSelectedItems((prevState) => prevState.filter((id) => id !== itemId));
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="reports-container p-4 flex-1">
      <div className="table-container bg-white border border-[#EAEAFF]  shadow-sm rounded-md p-4 max-w-[77vw]">
        <div className="w-full max-h-[400px] overflow-auto scrollbar-color">
          <table className="text-sm min-w-full table-auto">
            <thead className="text-[12px]">
              <tr className="border-b-[1px] border-[#F3E6F2]">
                <th className="p-2 text-center">
                  <input
                    type="checkbox"
                    className="cursor-pointer"
                    onChange={handleSelectAll}
                    checked={
                      paginatedData.length > 0 &&
                      paginatedData.every((item) => selectedItems.includes(item.id))
                    }
                    aria-label="Select All"
                  />
                </th>
                <th className="p-2 text-center font-medium">Sr</th>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="p-2 font-medium text-left whitespace-nowrap"
                    style={{ minWidth: "120px" }} // Adjust minWidth as needed
                  >
                    {column}
                  </th>
                ))}
                <th className="p-2 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={item.id} className="border-b-[1px] border-[#F3E6F2]">
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      className="cursor-pointer"
                      onChange={(e) => handleSelectItem(e, item.id)}
                      checked={selectedItems.includes(item.id)}
                      aria-label={`Select Row ${index + 1}`}
                    />
                  </td>
                  <td className="p-2 text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className="p-2 text-left text-[12px] font-medium text-gray-500"
                      style={{ minWidth: "120px" }} // Adjust minWidth as needed
                    >
                      {item[columnKeyMapping[col]] || "-"}
                    </td>
                  ))}
                  <td className="p-2 text-center">
                    <div className="flex justify-center">
                      <Download className="w-5 h-5 text-blue-600 cursor-pointer" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination-container flex items-center justify-between mt-4 flex-wrap gap-4 w-full">
        <div className="showing-container text-[#71717A] font-medium text-[12px]">
            Showing{" "}
            <span className="text-black">{String(currentPage).padStart(2, "0")}</span>{" "}
            of{" "}
            <span className="text-black">
              {String(totalPages).padStart(2, "0")}
            </span>
          </div>
          <div className="flex items-center font-medium text-[12px] gap-4">
            <button
              className={`bg-[#F3E6F2] p-2 rounded flex items-center gap-2 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              <LeftArrow className="w-5 h-5 text-gray-600" />
              Previous
            </button>
            <div className="text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            <button
              className={`bg-[#660F5D] text-white p-2 rounded flex items-center gap-2 ${
                currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
              <RightArrow className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsTable;
