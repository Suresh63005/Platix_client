import React, { useState } from "react";
import { Edit } from "@mui/icons-material";
import Select from "react-select"; // Import react-select
import { ReactComponent as DownArrow } from "../assets/images/Down Arrow.svg";

const UserServices = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: "", price: "" });
  const [editingIndex, setEditingIndex] = useState(null); // To track the editing state

  // Service options for the dropdown
  const serviceOptions = [
    { value: "Service 1", label: "Service 1" },
    { value: "Service 2", label: "Service 2" },
    { value: "Service 3", label: "Service 3" },
  ];

  // Add a new service
  const handleAddService = () => {
    if (!newService.name || !newService.price) return; // Prevent empty input
    setServices([...services, newService]);
    setNewService({ name: "", price: "" }); // Reset input fields
  };

  // Edit an existing service
  const handleEditService = (index) => {
    setEditingIndex(index); // Set the index for the service being edited
    setNewService({ ...services[index] }); // Populate the fields with the current values
  };

  // Save edited service
  const handleSaveService = () => {
    const updatedServices = [...services];
    updatedServices[editingIndex] = newService;
    setServices(updatedServices);
    setEditingIndex(null); // Exit edit mode
    setNewService({ name: "", price: "" }); // Reset input fields
  };

  // Delete a service
  const handleDeleteService = (index) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">User Services</h3>
      <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
        {/* Replace the native select with react-select */}
        <div className="w-full sm:w-1/2">
          <Select
            value={
              newService.name
                ? serviceOptions.find((option) => option.value === newService.name)
                : null
            }
            onChange={(selectedOption) =>
              setNewService({ ...newService, name: selectedOption.value })
            }
            options={serviceOptions}
            placeholder="Select service"
            className="text-[12px]" // Additional classes
            styles={{
              control: (base, {isFocused}) => ({
                ...base,
                border: isFocused ? "2px solid #660F5D" : " 1px solid #EAEAFF",
                boxShadow: isFocused ? 'none':'none',
                borderRadius: "5px",
                padding: "2px",
                fontSize: "12px", // Consistent font size
                color: "#757575",
                height:"42px",
                
                "&:hover":{
                  
                }
              }),
              placeholder: (base) => ({
                ...base,
                color: "#757575",
                fontSize: "12px", // Placeholder font size
              }),
              singleValue: (base) => ({
                ...base,
                fontSize: "12px",
                fontWeight: "600",
                color: "#757575",
                fontFamily: "Montserrat, sans-serif",
              }),
              option: (base) => ({
                ...base,
                backgroundColor: "white", // No background color change for selected state
                color: "#757575", // Default text color
                fontWeight: "100",
                cursor: "pointer",
                fontSize: "12px", // Option font size
                "&:hover": {
                  backgroundColor: "#660F5D", // Apply hover effect
                  color: "white", // Change text color to white on hover
                },
              }),
            }}
            components={{
              DropdownIndicator: () => (
                <DownArrow className="w-[16px] h-[16px] pr-1" /> // Use the custom DownArrow icon
              ),
              IndicatorSeparator: () => null, // Remove indicator separator
            }}
          />
        </div>
        <div className="w-full sm:w-1/4 relative">
          <span className="absolute top-2 left-2 text-gray-500">Price:</span>
          <input
            type="number"
            placeholder="Price"
            value={newService.price}
            onChange={(e) =>
              setNewService({ ...newService, price: e.target.value })
            }
            className="w-full pl-16 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#660F5D]"
          />
        </div>
        <div className="flex gap-2">
          {editingIndex === null ? (
           <span
           onClick={handleAddService}
           className="px-4 py-1 bg-[#660F5D] text-white rounded-md cursor-pointer"
         >
           Add
         </span>
          ) : (
            <span
              onClick={handleSaveService}
              className="px-4 py-1 bg-[#660F5D] text-white rounded-md cursor-pointer"
            >
              Save
            </span>
          )}
          <span
            onClick={() => setNewService({ name: "", price: "" })}
            className="px-7 py-1 bg-white text-gray-400 border-gray-700 border rounded-md cursor-pointer"
          >
            Clear
          </span>
        </div>
      </div>
      <hr />
      <div className="space-y-4">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row items-center gap-4 p-4"
          >
            <input
              type="text"
              value={service.name}
              readOnly
              className="flex-1 px-3 py-2 border rounded-md bg-white focus:outline-none"
            />
            <div className="w-full sm:w-1/4 relative">
              <span className="absolute top-2 left-2 text-gray-500">Price:</span>
              <input
                type="number"
                value={service.price}
                readOnly
                className="w-full pl-16 px-3 py-2 border rounded-md bg-white focus:outline-none"
              />
            </div>
            <span
              onClick={() => handleEditService(index)}
              className="flex items-center gap-1 px-4 py-2 bg-[#FAFAFA] text-[#660F5D] rounded-md cursor-pointer"
            >
              <Edit fontSize="small" />
              <span>Edit</span>
            </span>
            <span
              onClick={() => handleDeleteService(index)}
              className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-700 text-gray-700 rounded-md cursor-pointer"
            >
              <span>Delete</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserServices;
