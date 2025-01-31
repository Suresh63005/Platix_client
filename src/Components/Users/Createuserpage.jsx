import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
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
  const [user, setUser] = useState(null);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [formdata,setFormData] = useState({
    prefix:"",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    whatsAppNumber: "",
    dateOfBirth: "",
    role: "",
    designation: "",
    organization: "",
    startDate:"",
  })

  // Initialize useForm
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const formData = watch(); // Watch form data for real-time updates

  useEffect(() => {
    if (id) {
      const userData = usersData.find((user) => user.id === id);
      if (userData) {
        setUser(userData);
        setFormData(userData)
        reset(userData); // Pre-fill the form with user data
        handleRoleChange(userData.role); // Set designation options based on role
      }
    }
    if (mode === "view" || mode === "edit") {
      setMode(mode);
    } else {
      setMode("create");
    }
  }, [id, mode, reset]);

  const handleRoleChange = (selectedRole) => {
    setValue("role", selectedRole); // Update role in form data

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
          {
            value: "Oral Medicine & Radiologist",
            label: "Oral Medicine & Radiologist",
          },
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

  const onSubmit = (data) => {
    const message =
      mode === "edit" ? "User updated successfully" : "User created successfully";

    Swal.fire({
      text: message,
      imageUrl: TickSquare,
      imageWidth: 50,
      imageHeight: 50,
      background: "white",
      color: "black",
      showConfirmButton: false,
      showCloseButton: false,
      customClass: {
        popup: "swal-popup-custom",
      },
      willClose: () => {
        navigate("/userpage");
      },
    });
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="createuser-page-container flex flex-col min-h-screen bg-gray-100">
      <Header name="Organization" />
      <PageNavigation
        title={
          mode === "view"
            ? "View User"
            : mode === "edit"
            ? "Edit User"
            : "Create User"
        }
        onBackClick={handleBackClick}
      />

      <div className="create-user-form-container flex-1 bg-white px-6 py-4 rounded-lg shadow-md mx-4 mb-4">
        <form className="user-form-container space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <h3 className="form-title p-2 font-bold">
            {mode === "view"
              ? "View User"
              : mode === "edit"
              ? "Edit User"
              : "Create User"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SelectField
              label="Prefix*"
              defaultplaceholder="Select Prefix"
              options={[
                { value: "Mr", label: "Mr" },
                { value: "Mrs", label: "Mrs" },
              ]}
              value={formData.prefix || ""}
              onChange={(value) => setValue("prefix", value)}
              disabled={mode === "view"}
            />
            <SelectField
              label="Roles"
              defaultplaceholder="Select Role"
              options={[
                { value: "Dentist", label: "Dentist" },
                { value: "Dental Laboratory", label: "Dental Laboratory" },
                { value: "Radiology center", label: "Radiology center" },
                { value: "Material Supplier", label: "Material Supplier" },
              ]}
              value={formData.role || ""}
              onChange={(value) => handleRoleChange(value)}
              disabled={mode === "view"}
            />
            <InputField
              label="First Name"
              type="text"
              value={formData.firstName || ""}
              placeholder="Enter First name"
              {...register("firstName", { required: true })}
              disabled={mode === "view"}
            />
            <InputField
              label="Last Name"
              type="text"
              value={formData.lastName || ""}
              placeholder="Enter Last name"
              {...register("lastName", { required: true })}
              disabled={mode === "view"}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <InputField
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth || ""}
              {...register("dateOfBirth")}
              disabled={mode === "view"}
            />
            <InputField
              label="Email"
              type="email"
              value={formData.email || ""}
              placeholder="Enter email"
              {...register("email", { required: true })}
              disabled={mode === "view"}
            />
            <PhoneNumberInput
              label="Mobile Number"
              value={formData.phoneNumber || ""}
              onChange={(value) => setValue("phoneNumber", value)}
              defaultCountry="IN"
              disabled={mode === "view"}
            />
            <WhatsAppInput
              label="WhatsApp Number"
              value={formData.whatsAppNumber || ""}
              onChange={(value) => setValue("whatsAppNumber", value)}
              disabled={mode === "view"}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SelectField
              label="Designation"
              defaultplaceholder="Select Designation"
              options={designationOptions}
              value={formData.designation || ""}
              onChange={(value) => setValue("designation", value)}
              disabled={mode === "view"}
            />
            <InputField
              label="Organization"
              type="text"
              value={formData.organization || ""}
              placeholder="Organization"
              {...register("organization")}
              disabled={mode === "view"}
            />
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