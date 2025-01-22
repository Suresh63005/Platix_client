import React, { useState } from "react";
import { WhatsApp } from "@mui/icons-material";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { ReactComponent as UploadIcon } from "../assets/images/material-symbols_upload.svg";
import { ReactComponent as Delete } from "../assets/images/casual-delete.svg";
import { ReactComponent as Whatsappicon } from "../assets/images/whatsapp_icon.svg";

// Header Component
export const Header = ({ name }) => (
  <header className="bg-white p-4 shadow-md">
    <h1 className="text-xl font-semibold">{name}</h1>
  </header>
);

// Input Field Component
export const InputField = ({ label, type, placeholder, value, onChange }) => (
  <div className="mb-0">
    <label className="block text-xs font-medium mb-1">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 focus:outline-none focus:ring-2 focus-visible:ring-[#660F5D] rounded-md p-2 text-sm"
    />
  </div>
);

// Select Field Component
export const SelectField = ({ label, options, value, onChange }) => (
  <div className="mb-0">
    <label className="block text-xs font-medium mb-1">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-md p-2 text-[12px] focus:outline-none focus:ring-2 focus:ring-[#660F5D]"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// Phone Input Component
export const PhoneNumberInput = ({ label, value, onChange, defaultCountry }) => (
  <div className="mb-0">
    <label className="block text-xs font-medium mb-1">{label}</label>
    <div className="flex items-center rounded-md border border-gray-300 focus-within:border-[#660F5D] focus-within:ring-2 focus-within:ring-[#660F5D] overflow-hidden">
      <PhoneInput
        placeholder="Enter phone number"
        value={value}
        onChange={onChange}
        defaultCountry={defaultCountry}
        className="w-full p-2 text-sm focus-visible:outline-0"
        style={{
          border: "none", // Remove internal borders
          boxShadow: "none", // Remove internal focus shadows
        }}
      />
    </div>
  </div>
);

// WhatsApp Input Component
export const WhatsAppInput = ({ label, value, onChange }) => (
  <div className="mb-0">
    <label className="block text-xs font-medium mb-1">{label}</label>
    <div className="flex items-center rounded-md border border-gray-300 focus-within:border-[#660F5D] focus-within:ring-2 focus-within:ring-[#660F5D]">
      <Whatsappicon color="success" className="ml-2" fontSize="small" />
      <input
        type="text"
        placeholder="Enter WhatsApp number"
        value={value}
        onChange={onChange}
        className="w-full p-2 text-sm outline-none"
      />
    </div>
  </div>
);

// File Upload Component
export const FileUpload = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleDelete = (fileToDelete) => {
    setFiles((prevFiles) =>
      prevFiles.filter(
        (file) =>
          file.name !== fileToDelete.name || file.lastModified !== fileToDelete.lastModified
      )
    );
  };

  return (
    <div className="mt-4">
      {/* File Upload Input */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="w-full sm:w-[400px] border border-gray-300 rounded-md p-1 text-sm"
        />
        <button
          className="flex items-center gap-1 bg-[#660F5D] text-white px-7 py-1 rounded-md text-[12px]"
          onClick={(e) => e.preventDefault()}
        >
          <UploadIcon className="w-[15px]" />
          Upload
        </button>
      </div>

      {/* Uploaded Files List */}
      <div className="flex flex-col gap-2">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white-100 w-full sm:w-[400px] border-b-2 rounded-md p-2"
          >
            <span className="text-sm text-gray-700 truncate max-w-[300px]">
              {file.name}
            </span>
            <button
              className="flex items-center gap-1 text-[#660F5D] hover:text-red-500"
              onClick={() => handleDelete(file)}
            >
              <Delete className="w-[15px]" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Service Management Component
export const ServiceForm = () => {
  const [serviceList, setServiceList] = useState([]);
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleAddOrEditService = () => {
    const price = parseFloat(servicePrice);

    if (isEditing) {
      const updatedServiceList = [...serviceList];
      updatedServiceList[editIndex] = { name: serviceName, price };
      setServiceList(updatedServiceList);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      setServiceList([...serviceList, { name: serviceName, price }]);
    }

    setServiceName("");
    setServicePrice("");
  };

  const handleEditService = (index) => {
    setServiceName(serviceList[index].name);
    setServicePrice(serviceList[index].price.toString());
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDeleteService = (index) => {
    setServiceList(serviceList.filter((_, idx) => idx !== index));
  };

  return (
    <div className="p-4">
      <div className="space-y-4">
        {serviceList.map((service, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b pb-2"
          >
            <div>
              <p className="text-sm font-medium">{service.name}</p>
              <p className="text-sm text-gray-500">
                ₹ {service.price.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditService(index)}
                className="bg-[#660F5D] text-white px-4 py-1 rounded-md text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteService(index)}
                className="bg-white text-gray-500 px-4 py-1 rounded-md border border-gray-300 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <input
          type="text"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          placeholder="Service Name"
          className="border border-gray-300 px-4 py-2 rounded-md text-sm w-full mb-2"
        />
        <input
          type="number"
          value={servicePrice}
          onChange={(e) => setServicePrice(e.target.value)}
          placeholder="Service Price"
          className="border border-gray-300 px-4 py-2 rounded-md text-sm w-full mb-2"
        />
        <button
          onClick={handleAddOrEditService}
          className="bg-[#660F5D] text-white px-6 py-2 rounded-md text-sm"
        >
          {isEditing ? "Update Service" : "Add Service"}
        </button>
      </div>
    </div>
  );
};
