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
import axios from "axios";
import api from "../../utils/api";
import { useLoading } from "../../context/LoadingContext";
import Loader from "../../common/Loader";
import Cookies from "js-cookie";
import { useParams} from "react-router-dom";

const CreateUserPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { organization_id } = useParams();
  const { id, mode: initialMode} = location.state || {};
  console.log(organization_id)
  const { isLoading,setIsLoading }=useLoading();
  const [mode, setMode] = useState(initialMode || "create");
  const [designationOptions, setDesignationOptions] = useState([]);
  const [roles, setRoles] = useState([]); // State to store fetched roles
  const [showDesignationField, setShowDesignationField] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors }, setError, clearErrors,
  } = useForm();

  const formData = watch();
  useEffect(()=>{
    setIsLoading(true)

    const timer=setTimeout(() => {
      setIsLoading(false)
    }, 1000);
    return () => clearTimeout(timer)
  },[])

  // Fetch roles dynamically
  useEffect(() => {
        const token = Cookies.get("token");
    const fetchRoles = async () => {
      try {

        const response = await api.get("admin/viewrole",{
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const result = response.data.formattedRoles;

        if (result) {
          const roleOptions = result.map((role) => ({
            value: role.id,
            label: role.rolename,
          }));
          setRoles(roleOptions);
        } else {
          console.error("Failed to fetch roles: No roles found");
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  // Fetch user data if editing
  useEffect(() => {
    if (id  && (mode === "edit" || mode === "view")) {
      api
        .get(`user/getbyid/${id}`) 
        .then((response) => {
          const userData = response.data.user;
          console.log(userData)
          reset(userData); 
          handleRoleChange(userData.role_id); 
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
    setMode(initialMode || "create");
  }, [id, initialMode, reset]);

  const handleRoleChange = (selectedRoleId) => {
    setValue("role_id", selectedRoleId);
  
    const selectedRole = roles.find((role) => role.value === selectedRoleId);
    if (!selectedRole) return;
  
    switch (selectedRole.label) {
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
        setShowDesignationField(true); // Show designation for Dentist
        break;
      case "Dental Laboratory":
      case "Material Supplier":
      case "Radiology":
        setDesignationOptions([
          { value: "Owner", label: "Owner" },
          { value: "Technician", label: "Technician" },
          { value: "Delivery Boy", label: "Delivery Boy" },
        ]);
        setShowDesignationField(false); // Hide designation for other roles
        break;
      default:
        setDesignationOptions([]);
        setShowDesignationField(false); // Hide designation for unknown roles
        break;
    }
  };
  const onSubmit = async (data) => {
    try {
      const requestData = { ...data, organization_id };
      console.log(requestData);

      const response = await api.post("user/upsert", requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = response.data;

      if (response.status === 200 || response.status === 201) {
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
        }).then(() =>navigate(`/userspage/${organization_id}`));
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
    <div>
      {isLoading && <Loader />}
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
      {/* Prefix Field */}
      <div>
      <Controller
        name="prefix"
        control={control}
        defaultValue=""
        rules={{ required: "Prefix is required." }}
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
      {errors.prefix && <p className="text-red-500 text-xs">{errors.prefix.message}</p>}
      </div>

      {/* Role Field */}
      <div>
      <Controller
        name="role_id"
        control={control}
        defaultValue=""
        rules={{ required: "Role is required." }}
        render={({ field }) => (
          <SelectField
            label="Role*"
            defaultplaceholder="Select Role"
            options={roles}
            value={field.value}
            onChange={(value) => {
              field.onChange(value);
              handleRoleChange(value);
            }}
            disabled={mode === "view"}
          />
        )}
      />
      {errors.role_id && <p className="text-red-500 text-xs">{errors.role_id.message}</p>}
      </div>

     <div>
       {/* First Name */}
       <Controller
        name="firstName"
        control={control}
        defaultValue=""
        rules={{ required: "First Name is required." }}
        render={({ field }) => (
          <InputField
            label="First Name*"
            placeholder="Enter First Name"
            {...field}
            disabled={mode === "view"}
          />
        )}
      />
      {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}

     </div>
      {/* Last Name */}
     <div>
     <Controller
        name="lastName"
        control={control}
        defaultValue=""
        rules={{ required: "Last Name is required." }}
        render={({ field }) => (
          <InputField
            label="Last Name*"
            placeholder="Enter Last Name"
            {...field}
            disabled={mode === "view"}
          />
        )}
      />
      {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
     </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Date of Birth */}
    <div>
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
    </div>

      <div>
        {/* Email */}
      <Controller
        name="email"
        control={control}
        defaultValue=""
        rules={{ required: "Email is required.", pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email format" } }}
        render={({ field }) => (
          <InputField
            label="Email*"
            type="email"
            placeholder="Enter Email"
            {...field}
            disabled={mode === "view"}
          />
        )}
      />
      {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
      </div>

      {/* Mobile Number */}
      <div>
        <Controller
          name="mobileNo"
          control={control}
          defaultValue=""
          rules={{ required: "Mobile number is required." }}
          render={({ field }) => (
            <PhoneNumberInput
              label="Mobile Number*"
              {...field}
              defaultCountry="IN"
              placeholder="Enter Mobile Number"
              className="p-1"
              disabled={mode === "view"}
              onChange={(value) => {
                field.onChange(value);
                if (value && value.length > 12) {
                  setError("mobileNo", { type: "manual", message: "Mobile number cannot exceed 12 digits." });
                } else {
                  clearErrors("mobileNo");
                }
              }}
            />
          )}
        />
        {errors.mobileNo && <p className="text-red-500 text-xs">{errors.mobileNo.message}</p>}
      </div>

      {/* WhatsApp Number */}
      <div>
        <Controller
          name="whatsappNo"
          control={control}
          defaultValue=""
          rules={{ required: "WhatsApp number is required." }}
          render={({ field }) => (
            <WhatsAppInput
              label="WhatsApp Number*"
              {...field}
              className="p-1"
              disabled={mode === "view"}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers
                field.onChange(value);
                if (value.length > 10) {
                  setError("whatsappNo", { type: "manual", message: "WhatsApp number cannot exceed 10 digits." });
                } else {
                  clearErrors("whatsappNo");
                }
              }}
            />
          )}
        />
        {errors.whatsappNo && <p className="text-red-500 text-xs">{errors.whatsappNo.message}</p>}
      </div>
    </div>

    {/* Specialization (Designation) Field */}
    {showDesignationField && (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Controller
          name="designation"
          control={control}
          defaultValue=""
          rules={{ required: "Designation is required." }}
          render={({ field }) => (
            <SelectField
              label="Specialization*"
              defaultplaceholder="Select Designation"
              options={designationOptions || []}
              value={field.value}
              onChange={(value) => field.onChange(value)}
              disabled={mode === "view"}
            />
          )}
        />
        {errors.designation && <p className="text-red-500 text-xs">{errors.designation.message}</p>}
      </div>
    )}

    {/* Submit Buttons */}
    {mode !== "view" && (
      <div className="flex justify-end gap-3 mt-4">
        <button
          type="reset"
          className="flex items-center bg-white text-gray-500 px-4 py-1 rounded-md border border-gray-300 text-sm gap-2"
        >
          Cancel
        </button>
        <button type="submit" className="bg-[#660F5D] text-white px-7 py-1 rounded-md text-sm">
          {mode === "edit" ? "Update" : "Save"}
        </button>
      </div>
    )}
  </form>
</div>

    </div>
    </div>
  );
};

export default CreateUserPage;
