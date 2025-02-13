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


const CreateUserPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, mode: initialMode, organization_id } = location.state || {};
  const { isLoading,setIsLoading }=useLoading();
  const [mode, setMode] = useState(initialMode || "create");
  const [designationOptions, setDesignationOptions] = useState([]);
  const [roles, setRoles] = useState([]); // State to store fetched roles

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
        const result = response.data.roles;

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
        break;
      case "Dental Laboratory":
      case "Material Supplier":
      case "Radiology" :
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
            <Controller
              name="firstName"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <InputField
                  label="First Name*"
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
                  label="Last Name*"
                  placeholder="Enter Last Name"
                  {...field}
                  disabled={mode === "view"}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Controller
              name="dateOfBirth*"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <InputField label="Date of Birth" type="date" {...field} disabled={mode === "view"} />
              )}
            />
            <Controller
              name="email"
              control={control}
              defaultValue=""
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
            <Controller
              name="mobileNo"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <PhoneNumberInput
                  label="Mobile Number*"
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
                  label="WhatsApp Number*"
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
                  label="Designation*"
                  defaultplaceholder="Select Designation"
                  options={designationOptions || []}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  disabled={mode === "view"}
                />
              )}
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
    </div>
  );
};

export default CreateUserPage;
