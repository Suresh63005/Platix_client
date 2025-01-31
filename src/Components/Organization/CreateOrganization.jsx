import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert
import UserServices from "../../common/UserServices";
import {
  InputField,
  SelectField,
  WhatsAppInput,
  PhoneNumberInput,
  FileUpload,
} from "../../common/Input_fileds";
import Header from "../../common/Header";
import PageNavigation from "../../common/PageNavigation";
import TickSquare from "../../assets/images/TickSquare.svg";
import { organizationsData } from "../../Data/data";
import { ReactComponent as Cancelbtnicon } from "../../assets/images/Cancel_button_icon.svg";
import { useForm } from "react-hook-form"; // Import useForm

const CreateOrganization = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { id, mode: initialMode } = location.state || {};
  const [mode, setMode] = useState(initialMode || "create");
  const [organization, setOrganization] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    address: "",
    description: "",
    email: "",
    whatsapp: "",
    mobile: "",
    Longitude: "",
  });

  // Initialize form with useForm hook
  const { register, handleSubmit, setValue, watch, control, reset } = useForm();

  useEffect(() => {
    if (location.state) {
      const { mode, id } = location.state;
      if (mode === "edit") {
        setMode("edit");
      } else if (mode === "view") {
        setMode("view");
      }
    } else {
      setMode("create"); // Default to create if no mode provided
    }
  }, [location.state]);

  useEffect(() => {
    if (id) {
      const org = organizationsData.find((org) => org.id === id);
      setOrganization(org);
      setFormData({ ...org }); // Pre-fill the form with organization data if editing
    }
  }, [id, reset]);

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  const onSubmit = (data) => {
    // SweetAlert after form submission
    Swal.fire({
      text:
        mode === "edit"
          ? "Organization Updated Successfully"
          : "Organization Added successfully",
      imageUrl: TickSquare, // Add image for success icon
      imageWidth: 50,
      imageHeight: 50,
      background: "white",
      color: "black",
      showConfirmButton: false,
      showCloseButton: false,
      customClass: {
        popup: "swal-popup-custom",
        image: "swal-image-custom", // Apply custom styling for image
        title: "swal-no-gap", // Apply custom styling for text
      },
      willClose: () => {
        navigate("/organizationlist");
      },
    });
  };

  const handleSelectChange = (value, name) => {
    setValue(name, value); // Update form data in react-hook-form
    setFormData((prev) => ({ ...prev, [name]: value })); // Ensure UI updates properly
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-gray-100">
        <Header name={"Organization"} />
        <PageNavigation
          title={
            mode === "edit"
              ? "Edit Organization"
              : mode === "view"
              ? "View Organization"
              : "Create Organization"
          }
          onBackClick={handleBackClick}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="bg-white border border-[#EAEAFF] shadow-md rounded-lg p-6 mb-6">
          <h3 className="form-title text-lg font-bold mb-4">
            {mode === "view"
              ? "View Organization"
              : mode === "edit"
              ? "Edit Organization"
              : "Create Organization"}
          </h3>

          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <InputField
                label={"Organization Name"}
                type={"text"}
                placeholder={"Enter Organization Name"}
                {...register("name")}
                value={formData.name || ""}
                className="p-1"
                readOnly={mode === "view"}
              />
              <SelectField
                label="Organization Type"
                defaultplaceholder={"Select Role"}
                options={[
                  { value: "Dentist", label: "Dentist" },
                  { value: "Radiology", label: "Radiology" },
                  { value: "Material Supplier", label: "Material Supplier" },
                  { value: "Dental Laboratory", label: "Dental Laboratory" },
                ]}
                value={formData.type || ""}
                onChange={(value) => handleSelectChange(value, "type")}
                className="p-1 w-full"
                readOnly={mode === "view"}
              />
              <InputField
                label={"Address"}
                type={"text"}
                placeholder={"Enter Address"}
                {...register("address")}
                value={formData.address || ""}
                className="p-1"
                disabled={mode === "view"}
              />
              <div className="flex flex-col p-1 mt-[-5px]">
                <label
                  htmlFor="google-coordinates"
                  className="block text-xs font-medium"
                >
                  Google Coordinates
                </label>
                <div className="flex gap-2">
                  <InputField
                    type={"text"}
                    placeholder={"Latitude"}
                    {...register("googleCoordinates.latitude")}
                    value={formData.googleCoordinates?.latitude || ""}
                    className="p-1"
                    disabled={mode === "view"}
                  />
                  <InputField
                    type={"text"}
                    placeholder={"Longitude"}
                    {...register("googleCoordinates.longitude")}
                    value={formData.googleCoordinates?.longitude || ""}
                    className="p-1"
                    disabled={mode === "view"}
                  />
                </div>
              </div>
              <PhoneNumberInput
                label={"Mobile Number"}
                value={formData.mobile || ""}
                onChange={(value) => setValue("mobile", value)}
                defaultCountry={"IN"}
                className="p-1"
                disabled={mode === "view"}
              />
              <WhatsAppInput
                label={"WhatsApp Number"}
                value={formData.whatsapp || ""}
                onChange={(e) => setValue("whatsapp", e.target.value)}
                className="p-1"
                disabled={mode === "view"}
              />
              <InputField
                label={"Email"}
                type={"email"}
                placeholder={"Enter Email"}
                {...register("email")}
                value={formData.email || ""}
                className="p-1"
                disabled={mode === "view"}
              />
              <InputField
                label={"Description"}
                type={"text"}
                placeholder={"Enter Description"}
                {...register("description")}
                value={formData.description || ""}
                className="p-1"
                disabled={mode === "view"}
              />
            </div>

            {/* GST Number Field (Common for all roles except Dentist) */}
            {formData.type !== "Dentist" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <InputField
                  label="GST"
                  type="text"
                  placeholder="Enter GST Number"
                  {...register("gstNumber")}
                  value={formData.gstNumber || ""}
                  className="p-1"
                  disabled={mode === "view"}
                />
                <SelectField
                  label="Designation"
                  defaultplaceholder={"Select Designation"}
                  options={[
                    { value: "Owner", label: "Owner" },
                    { value: "Technician", label: "Technician" },
                    { value: "Delivery Boy", label: "Delivery Boy" },
                  ]}
                  value={formData.designation || ""}
                  onChange={(e) => handleSelectChange(e, "designation")}
                  className="p-1"
                  disabled={mode === "view"}
                />
              </div>
              
            )}
           
            {/* Dentist-specific fields */}
            {formData.type === "Dentist" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <InputField
                  label="Business Name"
                  type="text"
                  placeholder="Enter Business Name"
                  {...register("businessName")}
                  value={formData.businessName || ""}
                  className="p-1"
                  disabled={mode === "view"}
                />
                <InputField
                  label="Registration ID"
                  type="text"
                  placeholder="Enter Registration ID"
                  {...register("registrationId")}
                  value={formData.registrationId || ""}
                  className="p-1"
                  disabled={mode === "view"}
                />
                <SelectField
                  label="Designation"
                  defaultplaceholder={"Select Designation"}
                  options={[
                    { value: "Dentist", label: "Dentist" },
                    { value: "Orthodontist", label: "Orthodontist" },
                    { value: "Prosthodontist", label: "Prosthodontist" },
                    { value: "Oral surgeon", label: "Oral surgeon" },
                    { value: "Periodontist", label: "Periodontist" },
                    { value: "Implantologist", label: "Implantologist" },
                    { value: "Oral Pathologist", label: "Oral Pathologist" },
                    {
                      value: "Oral Medicine & Radiologist",
                      label: "Oral Medicine & Radiologist",
                    },
                    { value: "Community dentist", label: "Community dentist" },
                    { value: "Paeddontist", label: "Paeddontist" },
                  ]}
                  value={formData.designation || ""}
                  onChange={(value) => handleSelectChange(value, "designation")}
                  className="p-1"
                  disabled={mode === "view"}
                />
              </div>
            )}

            {/* Dental Laboratory-specific fields */}
           

            <FileUpload className="p-1" disabled={mode === "view"} />
            <FileUpload className="p-1" disabled={mode === "view"} />
           

            {mode !== "view" && (
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="reset"
                  className="flex items-center bg-white text-gray-500 px-4 py-1 rounded-md border border-gray-300 text-sm gap-2"
                >
                  <Cancelbtnicon className="w-4 h-4" /> {/* Icon added here */}
                  Cancel
                </button>
                <button
                  type="submit"
                  name="submit"
                  className="bg-[#660F5D] text-white px-7 py-1 rounded-md text-sm"
                >
                  {mode === "edit" ? "Update" : "Save"}
                </button>
              </div>
            )}
          </form>
        </div>

        {(formData.type === "Radiology" ||
          formData.type === "Material Supplier" ||
          formData.type === "Dental Laboratory") && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <UserServices />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateOrganization;