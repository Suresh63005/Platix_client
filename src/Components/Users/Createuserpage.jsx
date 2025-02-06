import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useForm, Controller } from "react-hook-form";
import {
  InputField,
  SelectField,
  PhoneNumberInput,
  WhatsAppInput,
} from "../../common/Input_fileds";
import Header from "../../common/Header";
import PageNavigation from "../../common/PageNavigation";
import TickSquare from "../../assets/images/TickSquare.svg";
import { usersData } from "../../Data/data";

const CreateUserPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { id, mode: initialMode } = location.state || {};
  const [mode, setMode] = useState(initialMode || "create");
  const [designationOptions, setDesignationOptions] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const formData = watch();

  useEffect(() => {
    if (id) {
      const userData = usersData.find((user) => user.id === id);
      if (userData) {
        reset(userData);
        handleRoleChange(userData.role);
      }
    }
    setMode(initialMode || "create");
  }, [id, initialMode, reset]);

  const handleRoleChange = (selectedRole) => {
    setValue("role_id", selectedRole);
    switch (selectedRole) {
      case "Dentist":
        setDesignationOptions([
          { value: "General Dentist", label: "General Dentist" },
          { value: "Prosthodontist", label: "Prosthodontist" },
          { value: "Oral surgeon", label: "Oral surgeon" },
          { value: "Periodontist", label: "Periodontist" },
          { value: "Implantologist", label: "Implantologist" },
          { value: "Orthodontist", label: "Orthodontist" },
          { value: "Oral Pathologist", label: "Oral Pathologist" },
          { value: "Oral Medicine & Radiologist", label: "Oral Medicine & Radiologist" },
          { value: "Community dentist", label: "Community dentist" },
          { value: "Paeddontist", label: "Paeddontist" },
        ]);
        break;
      case "Dental Laboratory":
        setDesignationOptions([
          { value: "Owner", label: "Owner" },
          { value: "Technician", label: "Technician" },
          { value: "Delivery Boy", label: "Delivery Boy" },
        ]);
        break;
      default:
        setDesignationOptions([]);
        break;
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:5000/user/upsert", {
        method: mode === "edit" ? "POST" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          text: mode === "edit" ? "User updated successfully" : "User created successfully",
          imageUrl: TickSquare,
          imageWidth: 50,
          imageHeight: 50,
          background: "white",
          color: "black",
          showConfirmButton: false,
          showCloseButton: false,
          timer: 2000,
          customClass: {
            popup: "swal-popup-custom",
          },
        }).then(() => navigate("/userpage"));
      } else {
        throw new Error(result.message || "Something went wrong");
      }
    } catch (error) {
      Swal.fire({
        text: `Error: ${error.message}`,
        icon: "error",
      });
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="createuser-page-container flex flex-col min-h-screen bg-gray-100">
      <Header name="User" />
      <PageNavigation
        title={mode === "view" ? "View User" : mode === "edit" ? "Edit User" : "Create User"}
        onBackClick={handleBackClick}
      />

      <div className="create-user-form-container flex-1 bg-white px-6 py-4 rounded-lg shadow-md mx-4 mb-4">
        <form className="user-form-container space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <h3 className="form-title p-2 font-bold">
            {mode === "view" ? "View User" : mode === "edit" ? "Edit User" : "Create User"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Controller
              name="prefix"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <SelectField
                  label="Prefix*"
                  defaultplaceholder="Select Prefix"
                  options={[{ value: "mr", label: "Mr" }, { value: "mrs", label: "Mrs" }]}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  disabled={mode === "view"}
                />
              )}
            />
            <Controller
              name="role_id"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <SelectField
                  label="Role"
                  defaultplaceholder="Select Role"
                  options={[
                    { value: "Dentist", label: "Dentist" },
                    { value: "Dental Laboratory", label: "Dental Laboratory" },
                    { value: "Radiology center", label: "Radiology center" },
                    { value: "Material Supplier", label: "Material Supplier" },
                  ]}
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    handleRoleChange(value);
                  }}
                  disabled={mode === "view"}
                />
              )}
            />
            <Controller
              name="firstName"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <InputField
                  label="First Name"
                  placeholder="Enter First Name"
                  {...field}
                  disabled={mode === "view"}
                />
              )}
            />
            <Controller
              name="lastName"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <InputField
                  label="Last Name"
                  placeholder="Enter Last Name"
                  {...field}
                  disabled={mode === "view"}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Controller
              name="dateOfBirth"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <InputField
                  label="Date of Birth"
                  type="date"
                  {...field}
                  disabled={mode === "view"}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <InputField
                  label="Email"
                  type="email"
                  placeholder="Enter Email"
                  {...field}
                  disabled={mode === "view"}
                />
              )}
            />
            <Controller
              name="mobileNo"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <PhoneNumberInput
                  label="Mobile Number"
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  defaultCountry="IN"
                  disabled={mode === "view"}
                />
              )}
            />
            <Controller
              name="whatsappNo"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <WhatsAppInput
                  label="WhatsApp Number"
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  disabled={mode === "view"}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Controller
              name="designation"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <SelectField
                  label="Designation"
                  defaultplaceholder="Select Designation"
                  options={designationOptions || []}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  disabled={mode === "view"}
                />
              )}
            />
            {/* <Controller
              name="organization"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <InputField
                  label="Organization"
                  placeholder="Enter Organization"
                  {...field}
                  disabled={mode === "view"}
                />
              )}
            /> */}
          </div>

          {mode !== "view" && (
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="reset"
                className="flex items-center bg-white text-gray-500 px-4 py-1 rounded-md border border-gray-300 text-sm gap-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#660F5D] text-white px-7 py-1 rounded-md text-sm"
              >
                {mode === "edit" ? "Update" : "Save"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateUserPage;