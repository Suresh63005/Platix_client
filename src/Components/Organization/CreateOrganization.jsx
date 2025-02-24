import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import {
  InputField,
  SelectField,
  WhatsAppInput,
  PhoneNumberInput,
  FileUpload,
} from "../../common/Input_fileds";
import Header from "../../common/Header";
import PageNavigation from "../../common/PageNavigation";
import Loader from "../../common/Loader";
import { ReactComponent as Cancelbtnicon } from "../../assets/images/Cancel_button_icon.svg";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { Edit } from "@mui/icons-material";
import Select from "react-select";
import { ReactComponent as DownArrow } from "../../assets/images/Down Arrow.svg";
import { Vortex } from "react-loader-spinner";
import api from "../../utils/api";
import { useLoading } from "../../context/LoadingContext";
import { organizationTypesData } from "../../Data/data";

const CreateOrganization = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, mode } = location.state || {};
  
  const { isLoading, setIsLoading } = useLoading();
  const [mode1, setMode1] = useState(mode || "create");
  
  const [organization, setOrganization] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();
  const [PImages, setPImages] = useState([]);
  const [loading, setloading] = useState(false);
  const [formData, setFormData] = useState({
    id: id || null,
    address: "",
    businessName: null,
    file1: null,
    file2: null,
    imgPreview: null,
    description: "",
    designation: "",
    email: "",
    googleCoordinates: { latitude: "", longitude: "" },
    gstNumber: null,
    mobile: "",
    name: "",
    registrationId: null,
    organizationType_id: "",
    whatsapp: "",
    services: [],
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    ifscCode: "",
    upiId: "",
  });
  const [availableServices, setAvailableServices] = useState([]);
  const [userServices, setUserServices] = useState([]);
  const [newService, setNewService] = useState({ name: "", price: "" });
  const [editingIndex, setEditingIndex] = useState(null);
  const [orgType, setOrgTYpe] = useState([]);
  // console.log(orgType, "from sdhfjghlj.gkfdjshfdgh.")

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [id, location, setIsLoading]);

  useEffect(() => {
    if (id && (mode1 === "edit" || mode1 === "view")) {
      api
        .get(`api/organization/getby/${id}`)
        .then((response) => {
          const orgData = response.data.data;

          setOrganization(orgData);

          // Populate form fields
          Object.keys(orgData).forEach((key) => {
            if (orgData[key] !== null && typeof orgData[key] === "object") {
              Object.keys(orgData[key]).forEach((nestedKey) => {
                setValue(`${key}.${nestedKey}`, orgData[key][nestedKey]);
              });
            } else {
              setValue(key, orgData[key]);
            }
          });

          // Set services if available
          if (orgData.services) {
            const servicesWithNames = orgData.services.map((service) => ({
              id: service.serviceDetail.id,
              name: service.serviceDetail.servicename || service.name,
              price: service.price,
            }));
            setUserServices(servicesWithNames);
          }
        })
        .catch((error) =>
          console.error("Error fetching organization data:", error)
        );
    } else {
      setMode1("create");
    }
    api
      .get("admin/allservices")
      .then((response) => {
        const servicesData = response.data.services;
        setAvailableServices(
          servicesData.map((service) => ({
            id: service.id,
            name: service.servicename,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
      });

    api
      .get("organization/getall")
      .then((response) => {
        const OrgData = response.data.results;
        // console.log(OrgData,"from orgdata");
        setOrgTYpe(
          OrgData.map((org) => ({
            value: org.id,
            label: org.organizationType,
            services: org.services,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
      });
  }, [id, mode1, setValue]);

  const dentistId = orgType.find((option) => option.label === "Dentist")?.value;
  const dynamicId = orgType
    .filter((option) =>
      ["Dental Laboratory", "Material Supplier", "Radiology"].includes(
        option.label
      )
    )
    .map((option) => option.value);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        file1: file,
        imgPreview: previewUrl,
        // [name]: files[0],
      }));
      setValue(name, files[0]);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setPImages(files);
    setValue("file2", files);
  };

  const handleAddService = () => {
    if (newService.id && newService.price) {
      setUserServices([...userServices, { ...newService }]); // ✅ Ensuring 'name' is included
      setNewService({ id: "", name: "", price: "" });
    } else {
      Swal.fire({
        icon: "warning",
        text: "Please select a service and enter a price!",
      });
    }
  };
  const handleSaveService = () => {
    if (editingIndex !== null) {
      const updatedServices = [...userServices];
      updatedServices[editingIndex] = newService;
      setUserServices(updatedServices);
      setEditingIndex(null);
      setNewService({ id: "", name: "", price: "" });
    }
  };

  const handleEditService = (index) => {
    const serviceToEdit = userServices[index];
    setEditingIndex(index);
    setNewService({
      id: serviceToEdit.id,
      name: serviceToEdit.name,
      price: serviceToEdit.price,
    });
  };

  const handleDeleteService = (index) => {
    const updatedServices = userServices.filter((_, i) => i !== index);

    setUserServices(updatedServices);
  };

  const onSubmit = async (data) => {
    setloading(true);
    try {
      console.log("Services before submission:", userServices); // Log the services
      console.log(data);
      const form = new FormData();
      form.append("name", data.name);
      form.append("organizationType_id", data.organizationType_id);
      form.append("address", data.address);
      form.append("googleCoordinates", JSON.stringify(data.googleCoordinates));
      form.append("mobile", data.mobile);
      form.append("whatsapp", data.whatsapp);
      form.append("email", data.email);
      form.append("description", data.description);
      form.append("gstNumber", data.gstNumber);
      form.append("designation", data.designation);
      form.append("businessName", data.businessName);
      form.append("registrationId", data.registrationId);
      form.append("bankName", data.bankName);
      form.append("accountNumber", data.accountNumber);
      form.append("accountHolder", data.accountHolder);
      form.append("ifscCode", data.ifscCode);
      form.append("upiId", data.upiId);

      // Add services to FormData
      form.append("services", JSON.stringify(userServices));

      if (id) {
        form.append("id", id);
      }

      if (data.file1) {
        form.append("file1", data.file1);
      }

      if (PImages.length > 0) {
        PImages.forEach((file) => {
          form.append("file2", file);
        });
      }

      const response = await api.post("api/organization/upsert", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setTimeout(() => {
        if (response.status === 201 || response.status === 200) {
          Swal.fire({
            text:
              mode1 === "edit"
                ? "Organization Updated Successfully"
                : "Organization Added Successfully",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            willClose: () => {
              navigate("/organizationlist");
            },
          });
          // reset();
        }
      }, 2000);
    } catch (error) {
      Swal.fire({
        text: "Error submitting the form.",
        icon: "error",
      });
      console.error("Form submission error:", error);
    } finally {
      setloading(false);
    }
  };

  const [servicesList, setServicesList] = useState({});

  async function handleOrginazationtypeid(id) {
    try {
      const filteredList = orgType.filter((data) => data.value === id);
      setServicesList(filteredList);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      {isLoading && <Loader />}
      <div className="flex flex-col h-screen bg-gray-100">
        <div className="bg-gray-100">
          <Header name={"Organization"} />
          <PageNavigation
            title={
              mode1 === "edit"
                ? "Edit Organization"
                : mode1 === "view"
                ? "View Organization"
                : "Create Organization"
            }
            onBackClick={handleBackClick}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="bg-white border border-[#EAEAFF] shadow-md rounded-lg p-6 mb-6">
            <h3 className="form-title text-lg font-bold mb-4">
              {mode1 === "view"
                ? "View Organization"
                : mode1 === "edit"
                ? "Edit Organization"
                : "Create Organization"}
            </h3>

            <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <InputField
                    label={"Organization Name*"}
                    type={"text"}
                    placeholder={"Enter Organization Name"}
                    {...register("name", {
                      required: "Organization Name required.",
                    })}
                    readOnly={mode1}
                  />
                  {errors.name && (
                    <p className="text-red-500 mt-2  text-xs">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Controller
                    name="organizationType_id"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Organization Type is required." }}
                    render={({ field }) => (
                      <SelectField
                        label="Organization Type*"
                        defaultplaceholder="Select Organization Type"
                        options={orgType}
                        readOnly
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          handleOrginazationtypeid(value);
                        }}
                        disabled={mode1}
                      />
                    )}
                  />
                  {errors.organizationType_id && (
                    <p className="text-red-500 text-xs">
                      {errors.organizationType_id.message}
                    </p>
                  )}
                </div>

                <div>
                  <InputField
                    label={"Address*"}
                    type={"text"}
                    placeholder={"Enter Address"}
                    {...register("address", {
                      required: "address is required.",
                    })}
                    readOnly={mode1}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs">
                      {errors.address.message}
                    </p>
                  )}
                </div>
                <div>
                  <div className="flex flex-col p-1 mt-[-5px]">
                    <label
                      htmlFor="google-coordinates"
                      className="block text-xs font-medium"
                    >
                      Google Coordinates*
                    </label>
                    <div className="flex gap-2">
                      <InputField
                        type={"text"}
                        placeholder={"Latitude"}
                        {...register("googleCoordinates.latitude", {
                          required: "Coordinates is required.",
                        })}
                        readOnly={mode1}
                      />
                      <InputField
                        type={"text"}
                        placeholder={"Longitude"}
                        {...register("googleCoordinates.longitude", {
                          required: "Coordinates is required.",
                        })}
                        readOnly={mode1}
                      />
                    </div>
                    {errors.googleCoordinates?.longitude && (
                      <p className="text-red-500 text-xs">
                        {errors.googleCoordinates?.longitude.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Controller
                    name="mobile"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Mobile number is required." }} // Validation rule directly inside Controller
                    render={({ field }) => (
                      <PhoneNumberInput
                        label={"Mobile Number*"}
                        {...field}
                        defaultCountry={"IN"}
                        placeholder={"Enter Mobile Number"}
                        className="p-1"
                        readOnly={mode1}
                        onChange={(value) => {
                          field.onChange(value); // Pass the value directly to field.onChange

                          if (value && value.length < 10) {
                            setError("mobile", {
                              type: "manual",
                              message:
                                "Mobile number must be at least 10 digits.",
                            });
                          } else if (value && value.length > 13) {
                            setError("mobile", {
                              type: "manual",
                              message: "Mobile number cannot exceed 10 digits.",
                            });
                          } else {
                            clearErrors("mobile");
                          }
                        }}
                      />
                    )}
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-xs">
                      {errors.mobile.message}
                    </p>
                  )}
                </div>

                {/* WhatsApp Number Input */}
                <div>
                  <Controller
                    name="whatsapp"
                    control={control}
                    defaultValue=""
                    rules={{ required: "WhatsApp number is required." }} // Validation rule directly inside Controller
                    render={({ field }) => (
                      <WhatsAppInput
                        label={"WhatsApp Number*"}
                        {...field}
                        className="p-1"
                        readOnly={mode1}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers
                          field.onChange(value); // Pass the value directly to field.onChange
                          // Validate WhatsApp number length directly in the Controller
                          if (value.length > 10) {
                            setError("whatsapp", {
                              type: "manual",
                              message:
                                "WhatsApp number cannot exceed 10 digits.",
                            });
                          } else {
                            clearErrors("whatsapp");
                          }
                        }}
                      />
                    )}
                  />
                  {errors.whatsapp && (
                    <p className="text-red-500 text-xs">
                      {errors.whatsapp.message}
                    </p>
                  )}
                </div>

                <div>
                  <InputField
                    label={"Email*"}
                    type={"email"}
                    placeholder={"Enter Email"}
                    {...register("email", { required: "email is required." })}
                    readOnly={mode1}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <InputField
                    label={"Description"}
                    type={"text"}
                    placeholder={"Enter Description"}
                    {...register("description")}
                    readOnly={mode1}
                  />
                </div>
              </div>

              {dynamicId.includes(watch("organizationType_id")) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <InputField
                      label="GST*"
                      type="text"
                      placeholder="Enter GST Number"
                      {...register("gstNumber", {
                        required: "GST is required.",
                      })}
                      readOnly={mode1}
                    />
                    {errors.gstNumber && (
                      <p className="text-red-500 text-xs">
                        {errors.gstNumber.message}
                      </p>
                    )}
                  </div>
                  {/* <Controller
                    name="designation"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <SelectField
                        label="Designation*"
                        defaultplaceholder={"Select Designation"}
                        options={[
                          { value: "Owner", label: "Owner" },
                          { value: "Technician", label: "Technician" },
                          { value: "Delivery Boy", label: "Delivery Boy" },
                        ]}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        className="p-1"
                        readOnly={mode1}
                      />
                    )}
                  /> */}
                </div>
              )}

              {watch("organizationType_id") === dentistId && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* <InputField
                  label="Business Name"
                  type="text"
                  placeholder="Enter Business Name"
                  {...register("businessName")}
                  readOnly={mode1}
                /> */}
                  <div>
                    <InputField
                      label="Registration ID*"
                      type="text"
                      placeholder="Enter Registration ID"
                      {...register("registrationId", {
                        required: "registration id is required.",
                      })}
                      readOnly={mode1}
                    />
                  </div>
                  {/* <Controller
                    name="designation"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <SelectField
                        label="Designation*"
                        defaultplaceholder={"Select Designation"}
                        options={[
                          { value: "Dentist", label: "Dentist" },
                          { value: "Orthodontist", label: "Orthodontist" },
                          { value: "Prosthodontist", label: "Prosthodontist" },
                          { value: "Oral surgeon", label: "Oral surgeon" },
                          { value: "Periodontist", label: "Periodontist" },
                          { value: "Implantologist", label: "Implantologist" },
                          {
                            value: "Oral Pathologist",
                            label: "Oral Pathologist",
                          },
                          {
                            value: "Oral Medicine & Radiologist",
                            label: "Oral Medicine & Radiologist",
                          },
                          {
                            value: "Community dentist",
                            label: "Community dentist",
                          },
                          { value: "Paeddontist", label: "Paeddontist" },
                        ]}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        className="p-1"
                        readOnly={mode1}
                      />
                    )}
                  /> */}
                </div>
              )}
              {/* Organization Account Details */}
              <h3 className="text-lg font-bold mb-4 mt-6">
                Organization Account Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <InputField
                    label={"Bank Name*"}
                    type={"text"}
                    placeholder={"Enter Bank Name"}
                    {...register("bankName", {
                      required: "bankname is required.",
                    })}
                    readOnly={mode1}
                  />
                  {errors.bankName && (
                    <p className="text-red-500 text-xs">
                      {errors.bankName.message}
                    </p>
                  )}
                </div>
                <div>
                  <InputField
                    label={"Organization Account Number*"}
                    type={"text"}
                    placeholder={"Enter Account Number"}
                    {...register("accountNumber", {
                      required: "account number is required.",
                    })}
                    readOnly={mode1}
                  />
                  {errors.accountNumber && (
                    <p className="text-red-500 text-xs">
                      {errors.accountNumber.message}
                    </p>
                  )}
                </div>
                <div>
                  <InputField
                    label={"Account Holder Name*"}
                    type={"text"}
                    placeholder={"Enter Account Holder Name"}
                    {...register("accountHolder", {
                      required: "Account Holder is required.",
                    })}
                    readOnly={mode1}
                  />
                  {errors.accountHolder && (
                    <p className="text-red-500 text-xs">
                      {errors.accountHolder.message}
                    </p>
                  )}
                </div>
                <div>
                  <InputField
                    label={"IFSC Code*"}
                    type={"text"}
                    placeholder={"Enter IFSC Code"}
                    {...register("ifscCode", {
                      required: "IFSC code is required.",
                    })}
                    readOnly={mode1}
                  />
                  {errors.ifscCode && (
                    <p className="text-red-500 text-xs">
                      {errors.ifscCode.message}
                    </p>
                  )}
                </div>
                <div>
                  <InputField
                    label={"UPI ID*"}
                    type={"text"}
                    placeholder={"Enter UPI ID"}
                    {...register("upiId", { required: "UPI ID is required." })}
                    readOnly={mode1}
                  />
                  {errors.upiId && (
                    <p className="text-red-500 text-xs">
                      {errors.upiId.message}
                    </p>
                  )}
                </div>
              </div>
              {dynamicId.includes(watch("organizationType_id")) && (
                <div className="">
                  <h3 className="text-lg font-semibold mb-4">Services</h3>
                  <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
                    <div className="w-full sm:w-1/2">
                      <Select
                      isDisabled={mode1==="view"}
                        value={
                          newService.id
                            ? {
                                id: newService.id,
                                value: newService.id,
                                label: newService.name,
                              }
                            : null
                        }
                        onChange={(selectedOption) =>
                          setNewService({
                            ...newService,
                            id: selectedOption.id,
                            name: selectedOption.label,
                          })
                        }
                        options={servicesList[0]?.services?.map((service) => ({
                          id: service?.id,
                          value: service?.id,
                          label: service?.servicename,
                        }))}
                        placeholder="Select service"
                        className="text-[12px]"
                        styles={{
                          control: (base, { isFocused }) => ({
                            ...base,
                            border: isFocused
                              ? "2px solid #660F5D"
                              : " 1px solid #EAEAFF",
                            boxShadow: isFocused ? "none" : "none",
                            borderRadius: "5px",
                            padding: "2px",
                            fontSize: "12px", // Consistent font size
                            color: "#757575",
                            height: "42px",

                            "&:hover": {},
                          }),
                          placeholder: (base) => ({
                            ...base,
                            color: "#757575",
                            fontSize: "12px",
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
                            backgroundColor: "white",
                            color: "#757575",
                            fontWeight: "100",
                            cursor: "pointer",
                            fontSize: "12px",
                            "&:hover": {
                              backgroundColor: "#660F5D",
                              color: "white",
                            },
                          }),
                        }}
                        components={{
                          DropdownIndicator: () => (
                            <DownArrow className="w-[16px] h-[16px] pr-1" />
                          ),
                          IndicatorSeparator: () => null,
                        }}
                      />
                    </div>
                    <div className="w-full sm:w-1/4 relative">
                      <span className="absolute top-2 left-2 text-gray-500">
                        Price:
                      </span>
                      <input
                        type="number"
                        min={0}
                        readOnly={mode1 === "view"}
                        disabled={mode1 === "view"}
                        placeholder="Price"
                        value={newService.price}
                        onChange={(e) =>
                          setNewService({
                            ...newService,
                            price: e.target.value,
                          })
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
                        disabled={mode1 === "view"}
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
                    {userServices.map((service, index) => (
                      <div
                        key={service.id}
                        className="flex flex-col sm:flex-row items-center gap-4 p-4"
                      >
                        <input type="hidden" value={service.id} />
                        <input
                          type="text"
                          value={service.name}
                          readOnly
                          className="flex-1 px-3 py-2 border rounded-md bg-white"
                        />
                        <div className="w-full sm:w-1/4 relative">
                          <span className="absolute top-2 left-2 text-gray-500">
                            Price:
                          </span>
                          <input
                            type="number"
                            value={service.price}
                            readOnly
                            className="w-full pl-16 px-3 py-2 border rounded-md bg-white"
                          />
                        </div>
                        <span
                          onClick={() => handleEditService(index)}
                          disabled={mode1 === "view"}
                          className="px-4 py-2 bg-[#FAFAFA] text-[#660F5D] rounded-md cursor-pointer"
                        >
                          Edit
                        </span>
                        <span
                        disabled={mode1 === "view"}
                          onClick={() => handleDeleteService(index)} // Pass the correct index
                          className="px-4 py-2 bg-white border border-gray-700 text-gray-700 rounded-md cursor-pointer"
                        >
                          Delete
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                {/* File Upload Input */}
                <Controller
                  name="file1"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <FileUpload
                      name="file1"
                      label="Choose file for profile*"
                      multiple={false}
                      readOnly={mode1}
                      onChange={handleChange} // Ensure this is correctly handling file selection
                    />
                  )}
                />

                {/* Display the image preview */}
                {/* {formData.imgPreview && (
    <div className="mt-2 w-[50px] h-[50px]">
      <img
        src={formData.imgPreview}
        alt="Preview"
        className="w-full h-full rounded-md"
      />
    </div>
  )} */}

                {/* Display the existing image if in edit/view mode1 */}
                {organization?.file1 && !formData.imgPreview && (
                  <div className="mt-2 w-[50px] h-[50px]">
                    <img
                      src={organization.file1}
                      alt="Existing"
                      className="w-full h-full rounded-md"
                    />
                  </div>
                )}
              </div>

              <div>
                <Controller
                  name="file2"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <FileUpload
                      name="file2"
                      label="Choose file (Max 3 images)"
                      multiple={true}
                      readOnly={mode1}
                      onChange={handleImageUpload}
                    />
                  )}
                />

{organization?.file2 && (
<div className="flex gap-3">
{
  organization?.file2.map((item)=>(
    <div className="mt-2 w-[50px] h-[50px]">
                        <img
                          src={item}
                          alt="Existing"
                          className="w-full h-full rounded-md"
                        />
                      </div>
    ))
}

</div>

                  
                )}
              </div>

              {mode1 !== "view" && (
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="reset"
                    onClick={() => navigate("/organizationlist")}
                    className="flex items-center bg-white text-gray-500 px-4 py-1 rounded-md border border-gray-300 text-sm gap-2"
                  >
                    <Cancelbtnicon className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    name="submit"
                    className="bg-[#660F5D] text-white px-7 py-1 rounded-md text-sm"
                  >
                    {loading ? (
                      <Vortex
                        visible={true}
                        height="25"
                        width="50"
                        ariaLabel="vortex-loading"
                        wrapperStyle={{}}
                        wrapperClass="vortex-wrapper"
                        colors={[
                          "white",
                          "white",
                          "white",
                          "white",
                          "white",
                          "white",
                        ]}
                      />
                    ) : mode1 === "edit" ? (
                      "Update"
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrganization;
