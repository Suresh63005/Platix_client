import React, { useState, forwardRef,useRef } from "react";
import { WhatsApp } from "@mui/icons-material";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { ReactComponent as UploadIcon } from "../assets/images/material-symbols_upload.svg";
import { ReactComponent as Delete } from "../assets/images/casual-delete.svg";
import { ReactComponent as Whatsappicon } from "../assets/images/whatsapp_icon.svg";
import { ReactComponent as DownArrow } from "../assets/images/Down Arrow.svg";
import Select from "react-select"; // Import react-select

// Header Component with forwardRef
export const Header = forwardRef(({ name }, ref) => (
  <header ref={ref} className="bg-white p-4 shadow-md">
    <h1 className="text-xl font-semibold">{name}</h1>
  </header>
));

// Input Field Component with forwardRef
export const InputField = forwardRef(({ label, type, placeholder, value, onChange, name }, ref) => (
  <div className="mb-0">
    <label className="block text-xs font-medium mb-1">{label}</label>
    <input
      ref={ref}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full border border-[#EAEAFF] font-medium focus:outline-none focus:ring-2 focus-visible:ring-[#660F5D] rounded-md p-2 text-[12px] h-[42px]  text-[#757575] font-['Montserrat', sans-serif]"
    />
  </div>
));

// Select Field Component using react-select with forwardRef
export const SelectField = forwardRef(({ label, options, value, onChange, name, defaultplaceholder }, ref) => (
  <div className="mb-0">
    <label className="block text-xs font-medium mb-1">{label}</label>
    <Select
      ref={ref}
      value={
        value ? options.find((option) => option.value === value) : { value: "", label: defaultplaceholder, isDisabled: true }
      }
      onChange={(selectedOption) => {
        if (selectedOption) {
          onChange(selectedOption.value); // Directly pass the selected value
        }
      }}
      options={options}
      name={name}
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
          color:"#757575",
          fontFamily:"Montserrat', sans-serif",
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
));

// Phone Input Component with forwardRef
export const PhoneNumberInput = forwardRef(({ label, value, onChange, defaultCountry, name }, ref) => (
  <div className="mb-0">
    <label className="block text-xs font-medium mb-1">{label}</label>
    <div className="flex items-center rounded-md border border-[#EAEAFF] focus-within:border-[#660F5D] focus-within:ring-2 focus-within:ring-[#660F5D] overflow-hidden font-medium text-[#757575]">
      <PhoneInput
        ref={ref}
        placeholder="Enter phone number"
        name={name}
        value={value}
        onChange={onChange}
        defaultCountry={defaultCountry}
        className="w-full p-2 text-sm focus-visible:outline-0 h-[42px] "
        style={{
          border: "none", 
          boxShadow: "none",
        }}
      />
    </div>
  </div>
));

// WhatsApp Input Component with forwardRef
export const WhatsAppInput = forwardRef(({ label, value, onChange, name }, ref) => (
  <div className="mb-0">
    <label className="block text-xs font-medium mb-1">{label}</label>
    <div className="flex items-center rounded-md border border-[#EAEAFF] focus-within:border-[#660F5D] focus-within:ring-2 focus-within:ring-[#660F5D] overflow-hidden font-medium text-[#757575]">
      <Whatsappicon color="success" className="ml-2" fontSize="small" />
      <input
        ref={ref}
        type="text"
        name={name}
        placeholder="Enter WhatsApp number"
        value={value}
        onChange={onChange}
        className="w-full p-2 text-sm outline-none h-[42px] "
      />
    </div>
  </div>
));

// File Upload Component with forwardRef
export const FileUpload = forwardRef(({ name, onChange, multiple = false }, ref) => {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null); // Reference to the file input

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);

    const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
    setFiles(updatedFiles);

    // Pass the files to the parent form
    if (onChange) {
      onChange({
        target: {
          name,
          files: updatedFiles,
        },
      });
    }
  };

  const handleDelete = (fileToDelete) => {
    const updatedFiles = files.filter(
      (file) =>
        file.name !== fileToDelete.name ||
        file.lastModified !== fileToDelete.lastModified
    );
    setFiles(updatedFiles);

    // Update parent form after deletion
    if (onChange) {
      onChange({
        target: {
          name,
          files: updatedFiles,
        },
      });
    }

    // Clear the file input after deleting
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input value
    }
  };

  return (
    <div ref={ref} className="mt-4">
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <input
          ref={fileInputRef} // Add the reference to the file input
          type="file"
          name={name}
          multiple={multiple}
          onChange={handleFileChange}
          className="w-full sm:w-[350px] border border-gray-300 rounded-md p-1 text-sm"
        />
        {/* <button
          className="flex items-center gap-1 bg-[#660F5D] text-white px-7 py-1 rounded-md text-[12px]"
          onClick={(e) => e.preventDefault()}
        >
          <UploadIcon className="w-[15px]" />
          Upload
        </button> */}
      </div>

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
});
// Service Form Component with forwardRef
export const ServiceForm = forwardRef((props, ref) => {
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
    <div ref={ref} className="p-4">
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
});
