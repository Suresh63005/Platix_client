import React, { useState } from "react";
import { Edit } from "@mui/icons-material";

const UserServices = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: "", price: "" });
  const [editingIndex, setEditingIndex] = useState(null); // To track the editing state

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
    <div className="p-6 rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-4">User Services</h3>
      <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
        <select
          value={newService.name}
          onChange={(e) => setNewService({ ...newService, name: e.target.value })}
          className="w-full sm:w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#660F5D]"
        >
          <option value="" disabled>
            Select service
          </option>
          <option value="Service 1">Service 1</option>
          <option value="Service 2">Service 2</option>
          <option value="Service 3">Service 3</option>
        </select>
        <div className="w-full sm:w-1/4 relative">
          <span className="absolute top-2 left-2 text-gray-500">Price:</span>
          <input
            type="number"
            placeholder="Price"
            value={newService.price}
            onChange={(e) => setNewService({ ...newService, price: e.target.value })}
            className="w-full pl-16 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#660F5D]"
          />
        </div>
        <div className="flex gap-2">
          {editingIndex === null ? (
            <button
              onClick={handleAddService}
              className="px-7 py-1 bg-[#660F5D] text-white text-[12px] rounded-md "
            >
              Add
            </button>
          ) : (
            <button
              onClick={handleSaveService}
              className="px-4 py-1 bg-[#660F5D] text-white rounded-md "
            >
              Save
            </button>
          )}
          <button
            onClick={() => setNewService({ name: "", price: "" })}
            className="px-7 py-1 bg-white text-gray-400 border-gray-700 border rounded-md "
          >
            Clear
          </button>
        </div>
      </div>
      <hr />
      <div className="space-y-4">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-md"
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
            <button
              onClick={() => handleEditService(index)}
              className="flex items-center gap-1 px-4 py-2 bg-[#FAFAFA] text-[#660F5D] rounded-md "
            >
              <Edit fontSize="small" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => handleDeleteService(index)}
              className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-700 text-gray-700 rounded-md "
            >
              <span>Delete</span>
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <button className="px-7 py-1 border rounded-md">
          Cancel
        </button>
        <button className="px-7 py-1 bg-[#660F5D] text-white text-[12px] rounded-md ">
          Save
        </button>
      </div>
    </div>
  );
};

export default UserServices;
