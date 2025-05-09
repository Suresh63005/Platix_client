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
import api from "../../utils/api";
import { useLoading } from "../../context/LoadingContext";
import Loader from "../../common/Loader";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";

const CreateUserPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { organization_id } = useParams();
  const { id, mode: initialMode } = location.state || {};
  console.log(organization_id);
  const { isLoading, setIsLoading } = useLoading();
  const [mode, setMode] = useState(initialMode || "create");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [designationOptions, setDesignationOptions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showDesignationField, setShowDesignationField] = useState(false);
  const [organizationName, setOrganizationName] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    getValues,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  const formData = watch();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (organization_id) {
      api
        .get(`api/organization/getby/${organization_id}`)
        .then((response) => {
          const orgName = response.data.data.name;
          setOrganizationName(orgName);
          setValue("organizationName", orgName);
        })
        .catch((error) => {
          console.error("Error fetching organization name:", error);
          setOrganizationName("");
        });
    }
  }, [organization_id, setValue]);

  useEffect(() => {
    const token = Cookies.get("token");
    const fetchRoles = async () => {
      try {
        const response = await api.get("admin/viewrole", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  useEffect(() => {
    if (id && (mode === "edit" || mode === "view")) {
      api
        .get(`user/getbyid/${id}`)
        .then((response) => {
          const userData = response.data.user;
          console.log("User Data:", userData);
          const transformedData = {
            ...userData,
            prefix: userData.prefix ? userData.prefix.toLowerCase() : "",
          };
          reset(transformedData);
          console.log("Form State:", getValues());
          // Set designation field visibility based on role
          if (userData.role?.rolename === "Dentist") {
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
            setShowDesignationField(true);
          }
          // Call handleRoleChange only if roles are loaded
          if (roles.length > 0) {
            handleRoleChange(userData.role_id);
          }
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
    setMode(initialMode || "create");
  }, [id, initialMode, reset, getValues, roles]);

  const handleRoleChange = (selectedRoleId) => {
    setValue("role_id", selectedRoleId);
    const selectedRole = roles.find((role) => role.value === selectedRoleId);
    console.log("Selected Role:", selectedRole); // Debug
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
        setShowDesignationField(true);
        break;
      case "Dental Laboratory":
      case "Material Supplier":
      case "Radiology":
        setDesignationOptions([
          { value: "Owner", label: "Owner" },
          { value: "Technician", label: "Technician" },
          { value: "Delivery Boy", label: "Delivery Boy" },
        ]);
        setShowDesignationField(false);
        break;
      default:
        setDesignationOptions([]);
        setShowDesignationField(false);
        break;
    }
  };

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const requestData = {
        ...data,
        organization_id,
        prefix: data.prefix ? data.prefix.toUpperCase() : data.prefix,
        ...(mode === "edit" && { id }),
      };
      console.log("Request Data:", requestData);

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
        }).then(() => navigate(`/userspage/${organization_id}`));
      } else {
        throw new Error(result.message || "Something went wrong");
      }
    } catch (error) {
      if (error.response?.status === 400) {
        const errorMessage = error.response.data.message;
        if (errorMessage === "Email already exists") {
          setError("email", {
            type: "manual",
            message: "This email is already registered.",
          });
        } else if (errorMessage === "Mobile number already exists") {
          setError("mobileNo", {
            type: "manual",
            message: "This mobile number is already registered.",
          });
        } else {
          Swal.fire({
            text: `Error: ${errorMessage}`,
            icon: "error",
          });
        }
      } else {
        Swal.fire({
          text: `Error: ${error.message}`,
          icon: "error",
        });
      }
    } finally {
      setIsSubmitting(false);
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
                      options={[
                        { value: "mr", label: "Mr" },
                        { value: "ms", label: "Ms" },
                        { value: "mrs", label: "Mrs" },
                        { value: "dr", label: "Dr" },
                      ]}
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

              {/* First Name */}
              <div>
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
                      readOnly={mode === "view"}
                    Munch
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
                      readOnly={mode === "view"}
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
                      maxrestrictDate={new Date().toISOString().split("T")[0]}
                      restrictDate={null}
                      {...field}
                      readOnly={mode === "view"}
                    />
                  )}
                />
              </div>

              {/* Email */}
              <div>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Email is required.",
                    pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email format" },
                  }}
                  render={({ field }) => (
                    <InputField
                      label="Email*"
                      type="email"
                      placeholder="Enter Email"
                      {...field}
                      readOnly={mode === "view"}
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
                      readOnly={mode === "view"}
                      onChange={(value) => {
                        const numericValue = value ? value.replace(/[^0-9]/g, "") : "";
                        field.onChange(value);
                        if (numericValue.length > 12) {
                          setError("mobileNo", {
                            type: "manual",
                            message: "Mobile number cannot exceed 10 digits.",
                          });
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
                      readOnly={mode === "view"}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        field.onChange(value);
                        if (value.length > 10) {
                          setError("whatsappNo", {
                            type: "manual",
                            message: "WhatsApp number cannot exceed 10 digits.",
                          });
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {showDesignationField && (
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
              )}

              <InputField
                label="Organization Name"
                placeholder="Organization Name"
                value={organizationName}
                readOnly={true}
                className="p-1"
              />
            </div>

            {/* Submit Buttons */}
            {mode !== "view" && (
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="reset"
                  onClick={() => navigate(`/userspage/${organization_id}`)}
                  className="flex items-center bg-white text-gray-500 px-4 py-1 rounded-md border border-gray-300 text-sm gap-2"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`bg-[#660F5D] text-white px-7 py-1 rounded-md text-sm ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : mode === "edit" ? "Update" : "Save"}
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
