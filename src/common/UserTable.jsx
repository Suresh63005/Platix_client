import React, { useState } from "react";
import { ReactComponent as Delete } from "../assets/images/Delete.svg";
import { ReactComponent as Edit } from "../assets/images/Edit.svg";
import { ReactComponent as Eye } from "../assets/images/Show.svg";
import { ReactComponent as LeftArrow } from "../assets/images/Left Arrow.svg";
import { ReactComponent as RightArrow } from "../assets/images/Right Arrow.svg";

const Table = ({
  columns,
  data,
  page,
  totalPages,
  setPage,
  fields,
  setData,
  showActions = true,
  handleEdit,
  handleView,
  handleDelete,
  setSelectedItems,
  selectedItems
}) => {

  console.log(selectedItems,"select items")
  
  const [editingItem, setEditingItem] = useState(null);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allItems = data.map((item) => item.id);
      setSelectedItems(allItems);
    } else {
      setSelectedItems([]);
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
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  

  const handleSave = (itemId) => {
    setEditingItem(null);
  };

  return (
    <div className="userlist-container p-4 flex-1 overflow-auto scrollbar-color">
      <div className="usertable-container bg-white border border-[#EAEAFF] shadow-sm rounded-md p-4 h-[max-content] ">
        <table className="w-full table text-[12px] ">
          <thead className="text-[12px]">
            <tr className="border-b-[1px] border-[#F3E6F2] bg-white">
              <th className="p-2 text-center text-[12px]">
                <input
                  type="checkbox"
                  className="border-none cursor-pointer th-checkbox"
                  onChange={handleSelectAll}
                  checked={selectedItems?.length === data?.length}
                />
              </th>
              <th className="p-2 font-medium text-left">Sr</th>
              {columns.map((column, index) => {
                // Extract label and style if column is an object
                const label =
                  typeof column === "object" ? column.label : column;
                const style = typeof column === "object" ? column.style : {};
                return (
                  <th
                    key={index}
                    className="p-2 font-medium text-left"
                    style={style}
                  >
                    {label}
                  </th>
                );
              })}
              {showActions && (
                <>
                  <th className="p-2 font-medium text-center">Action</th>
                  <th className="p-2 font-medium text-center">View</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id} className="border-b border-[#F3E6F2] ">
                <td className="p-2 text-center text-[12px]">
                  <div className="custom-checkbox">
                    <input
                      type="checkbox"
                      className="cursor-pointer text-[12px]"
                      onChange={(e) => handleSelectItem(e, item.id)}
                      checked={selectedItems?.includes(item?.id)}
                    />
                    <div className="custom-checkbox-box"></div>{" "}
                    {/* Custom checkbox box */}
                  </div>
                </td>
                <td className="p-2 text-left text-[12px] font-medium text-[#4D5D6B]">
                  {(page - 1) * 10 + (index + 1)}
                </td>
                {fields.map((field, idx) => (
                  <td
                    key={idx}
                    className="p-2 text-left text-[12px] font-medium text-[#4D5D6B]"
                  >
                    {editingItem === item.id ? (
                      <input
                        type="text"
                        value={item[field]}
                        onChange={(e) => {
                          const updatedItem = {
                            ...item,
                            [field]: e.target.value,
                          };
                          setData(
                            data.map((dataItem) =>
                              dataItem.id === item.id ? updatedItem : dataItem
                            )
                          );
                        }}
                      />
                    ) : (
                      item[field]
                    )}
                  </td>
                ))}
                {showActions && (
                  <>
                    <td className="p-2 text-center">
                      <div className="flex gap-2 justify-center">
                        {editingItem === item.id ? (
                          <button
                            onClick={() => handleSave(item.id)}
                            className="w-5 h-5 text-green-600 cursor-pointer"
                          >
                            Save
                          </button>
                        ) : (
                          <Edit
                            className="w-5 h-5 text-gray-600 cursor-pointer"
                            onClick={() => {
                              handleEdit(item.id);
                              
                            }}
                          />
                        )}
                        <Delete
                          className="w-5 h-5 text-red-600 cursor-pointer"
                          onClick={() => handleDelete(item.id)}
                        />
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex justify-center items-center h-full">
                        <Eye
                          className="w-5 h-5 cursor-pointer"
                          onClick={() => handleView(item.id)}
                        />
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination-container flex items-center justify-between mt-4 flex-wrap gap-4">
          <div className="showing-container text-[#71717A] font-medium text-[12px]">
            Showing{" "}
            <span className="text-black">{String(page).padStart(2, "0")}</span>{" "}
            of{" "}
            <span className="text-black">
              {String(totalPages).padStart(2, "0")}
            </span>
          </div>

          <div className="flex items-center font-medium text-[12px] gap-4">
            <button
              className={`previous-container flex items-center gap-2 bg-[#F3E6F2] p-2 rounded cursor-pointer ${
                page === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handlePrevious}
              disabled={page === 1}
            >
              <LeftArrow className="w-4 h-4" />
              Previous
            </button>
            <div className="pagenumber-container text-[#660F5D]">
              Page {String(page).padStart(2, "0")} of{" "}
              {String(totalPages).padStart(2, "0")}
            </div>
            <button
              className={`next-container flex items-center gap-2 bg-[#660F5D] p-2 px-4 rounded text-white ${
                page === totalPages ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleNext}
              disabled={page === totalPages}
            >
              Next
              <RightArrow className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
