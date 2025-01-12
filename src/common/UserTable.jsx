import React, { useState } from "react";
import { ReactComponent as Delete } from "../assets/images/Delete.svg";
import { ReactComponent as Edit } from "../assets/images/Edit.svg";
import { ReactComponent as Eye } from "../assets/images/Show.svg";

const Table = ({ columns, data, page, totalPages, setPage, fields, setData }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null); // State for editing item

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allItems = data.map(item => item.id);
      setSelectedItems(allItems);
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (event, itemId) => {
    if (event.target.checked) {
      setSelectedItems(prevState => [...prevState, itemId]);
    } else {
      setSelectedItems(prevState => prevState.filter(id => id !== itemId));
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

  // Handle editing a row
  const handleEdit = (itemId) => {
    setEditingItem(itemId); // Set the item as editable
  };

  // Handle deleting a row
  const handleDelete = (itemId) => {
    const updatedData = data.filter(item => item.id !== itemId);
    setData(updatedData); // Remove the item from the data
  };

  // Handle saving the changes made to a row
  const handleSave = (itemId) => {
    // Perform saving logic here, for example, making API call
    setEditingItem(null); // Exit editing mode after saving
  };

  return (
    <div className="userlist-container p-4 flex-1 overflow-auto">
      <div className="usertable-container bg-white border border-[#EAE5FF] shadow-sm rounded-md p-4 overflow-x-auto h-full">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-[1px] bg-white">
              <th className="p-2 text-center">
                <input
                  type="checkbox"
                  className="border-none cursor-pointer"
                  onChange={handleSelectAll}
                  checked={selectedItems.length === data.length}
                />
              </th>
              <th className="p-2 font-medium text-center">Sr</th>
              {columns.map((column, index) => (
                <th key={index} className="p-2 font-medium text-center">{column}</th>
              ))}
              <th className="p-2 font-medium text-center">Action</th>
              <th className="p-2 font-medium text-center">View</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id} className="border-b">
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    className="focus:ring-2 cursor-pointer"
                    onChange={(e) => handleSelectItem(e, item.id)}
                    checked={selectedItems.includes(item.id)}
                  />
                </td>
                <td className="p-2 text-center text-[12px] font-medium text-[#4D5D6B]">{(page - 1) * 10 + (index + 1)}</td>
                {fields.map((field, idx) => (
                  <td key={idx} className="p-2 text-center text-[12px] font-medium text-[#4D5D6B]">
                    {editingItem === item.id ? (
                      <input
                        type="text"
                        value={item[field]}
                        onChange={(e) => {
                          const updatedItem = { ...item, [field]: e.target.value };
                          setData(data.map((dataItem) => dataItem.id === item.id ? updatedItem : dataItem));
                        }}
                      />
                    ) : (
                      item[field]
                    )}
                  </td>
                ))}
                <td className="p-2 text-center">
                  <div className="flex gap-2 justify-center">
                    {editingItem === item.id ? (
                      <button onClick={() => handleSave(item.id)} className="w-5 h-5 text-green-600 cursor-pointer">Save</button>
                    ) : (
                      <Edit className="w-5 h-5 text-gray-600 cursor-pointer" onClick={() => handleEdit(item.id)} />
                    )}
                    <Delete className="w-5 h-5 text-red-600 cursor-pointer" onClick={() => handleDelete(item.id)} />
                  </div>
                </td>
                <td className="p-2 flex justify-center">
                  <Eye className="w-5 h-5 text-blue-600 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination-container flex items-center justify-between mt-4 flex-wrap gap-4">
          <div className="showing-container text-[#660F5D] font-medium text-[12px]">
            Showing {String(page).padStart(2, "0")} of {String(totalPages).padStart(2, "0")}
          </div>
          <div className="flex items-center font-medium text-[12px] gap-4">
            <button
              className={`previous-container flex items-center gap-2 bg-[#F3E6F2] p-2 rounded cursor-pointer ${page === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handlePrevious}
              disabled={page === 1}
            >
              ← Previous
            </button>
            <div className="pagenumber-container text-[#660F5D]">
              Page {String(page).padStart(2, "0")} of {String(totalPages).padStart(2, "0")}
            </div>
            <button
              className={`next-container flex items-center gap-2 bg-[#660F5D] p-2 rounded text-white ${page === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleNext}
              disabled={page === totalPages}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
