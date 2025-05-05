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
import { toast, Toaster } from 'react-hot-toast';

const CreateOrganization = () => {
  const latitudeRegex = /^-?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;
  const longitudeRegex = /^-?((1[0-7]\d(\.\d+)?)|([1-9]?\d(\.\d+)?))$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const bankRegex = /^[a-zA-Z\s]{2,100}$/;
  const AccountNumberRegex = /^[0-9]{8,18}$/;
  const accountHolderRegex = /^[a-zA-Z\s]{2,100}$/;
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const location = useLocation();
  const navigate = useNavigate();
  const { id, mode } = location.state || {};
  const { isLoading, setIsLoading } = useLoading();
  const [mode1, setMode1] = useState(mode || "create");
  const [organization, setOrganization] = useState(null);
  const [files, setFiles] = useState([]);
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
    trigger,
  } = useForm();

  const [loading, setloading] = useState(false);
  const [formData, setFormData] = useState({
    id: id || null,
    address: [],
    businessName: null,
    file1: null,
    file2: null,
    imgPreview: null,
    description: "",
    designation: "",
    email: "",
    googleCoordinates: { latitude: "", longitude: "" },
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
    beneficiary_id: " ",
    googlemaplink: "",
  });

  const [vendorData, setVendorData] = useState({
    accountType: "",
    pan: "",
    gst: "",
    cin: "",
    aadhaar: "",
    drivingLicense: "",
    voterId: "",
    passportNumber: "",
  });

  const [availableServices, setAvailableServices] = useState([]);
  const [userServices, setUserServices] = useState([]);
  const [newService, setNewService] = useState({ name: "", price: "" });
  const [editingIndex, setEditingIndex] = useState(null);
  const [orgType, setOrgTYpe] = useState([]);
  const [servicesList, setServicesList] = useState({});
  const [orgTypeEditId, setOrgTypeEditId] = useState("");
  const [PImages, setPImages] = useState([]);
  const [imageExtra, setImageExtra] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState("");
  const [editingIndex2, setEditingIndex2] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const handleAddAddress = () => {
    if (newAddress.trim() !== "") {
      if (editingIndex2 !== null) {
        const updatedAddresses = [...addresses];
        updatedAddresses[editingIndex2] = newAddress;
        setAddresses(updatedAddresses);
        setEditingIndex2(null);
      } else {
        setAddresses([...addresses, newAddress]);
      }
      setNewAddress("");
    } else {
      Swal.fire({
        icon: "warning",
        text: "Please enter an address!",
      });
    }
  };

  const handleEditAddress = (index) => {
    setNewAddress(addresses[index]);
    setEditingIndex2(index);
  };

  const handleDeleteAddress = (index) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(updatedAddresses);
  };

  const handleClearAddress = () => {
    setNewAddress("");
    setEditingIndex2(null);
  };

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [id, location, setIsLoading]);

  useEffect(() => {
    setIsDataLoading(true);
    Promise.all([
      id && mode1 !== "create"
        ? api.get(`api/organization/getby/${id}`)
        : Promise.resolve(null),
      api.get("admin/allservices"),
      api.get("organization/getall"),
    ])
      .then(([orgResponse, servicesResponse, orgTypesResponse]) => {
        if (orgResponse) {
          const orgData = orgResponse.data.data;
          setOrganization(orgData);
          setOrgTypeEditId(orgData.organizationType_id);

          if (orgData?.services) {
            const servicesWithNames = orgData?.services?.map((service) => ({
              id: service?.serviceDetail.id,
              name: service?.serviceDetail?.servicename || service?.name,
              price: service?.price,
            }));
            setUserServices(servicesWithNames);
          }

          // Populate vendor data if available
          if (orgData?.vendor) {
            setVendorData({
              accountType: orgData.vendor.accountType || "",
              pan: orgData.vendor.pan || "",
              gst: orgData.vendor.gst || "",
              cin: orgData.vendor.cin || "",
              aadhaar: orgData.vendor.aadhaar || "",
              drivingLicense: orgData.vendor.drivingLicense || "",
              voterId: orgData.vendor.voterId || "",
              passportNumber: orgData.vendor.passportNumber || "",
            });
            // Set form values for vendor fields
            setValue("vendorData.accountType", orgData.vendor.accountType || "");
            setValue("vendorData.pan", orgData.vendor.pan || "");
            setValue("vendorData.gst", orgData.vendor.gst || "");
            setValue("vendorData.cin", orgData.vendor.cin || "");
            setValue("vendorData.aadhaar", orgData.vendor.aadhaar || "");
            setValue("vendorData.drivingLicense", orgData.vendor.drivingLicense || "");
            setValue("vendorData.voterId", orgData.vendor.voterId || "");
            setValue("vendorData.passportNumber", orgData.vendor.passportNumber || "");
          }

          Object.keys(orgData).forEach((key) => {
            if (orgData[key] !== null && typeof orgData[key] === "object" && key !== "vendor") {
              Object.keys(orgData[key]).forEach((nestedKey) => {
                setValue(`${key}.${nestedKey}`, orgData[key][nestedKey]);
              });
            } else if (key !== "vendor") {
              setValue(key, orgData[key]);
            }
          });

          let parsedAddress = [];
          if (typeof orgData.address === "string") {
            try {
              parsedAddress = JSON.parse(orgData.address);
              if (!Array.isArray(parsedAddress)) {
                parsedAddress = [parsedAddress];
              }
            } catch (error) {
              parsedAddress = [orgData.address];
            }
          } else if (Array.isArray(orgData.address)) {
            parsedAddress = orgData.address;
          }
          setAddresses(parsedAddress);
        }

        const servicesData = servicesResponse.data.services;
        setAvailableServices(
          servicesData?.map((service) => ({
            id: service.id,
            name: service.servicename,
          }))
        );

        const OrgData = orgTypesResponse.data.results;
        setOrgTYpe(
          OrgData.map((org) => ({
            value: org.id,
            label: org.organizationType,
            services: org.services,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setIsDataLoading(false);
      });
  }, [id, mode1, setValue]);

  const dentistId = orgType.find((option) => 
    option.label.toLowerCase() === "dentist"
  )?.value;

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      const maxSize = 1 * 1024 * 1024;
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        file1: file,
        imgPreview: previewUrl,
      }));
      setValue(name, file);
    }
  };

  useEffect(() => {
    setPImages(files);
  }, [files]);

  useEffect(() => {
    if (organization?.file2) {
      setImageExtra(organization.file2);
    }
  }, [organization?.file2]);

  const handleImageUpload = (e) => {
    const filess = Array.from(e.target.files);
    const maxFiles = 3;
    const maxSize = 1 * 1024 * 1024;
    
    setPImages(filess);
    setValue("file2", filess);
  };

  const handleDeleteImage = (index) => {
    const updatedImages = organization.file2.filter((_, i) => i !== index);
    setOrganization((prev) => ({
      ...prev,
      file2: updatedImages,
    }));
    const updatedImages1 = PImages.filter((_, i) => i !== index);
    setImageExtra(updatedImages1);
  };

  const handleAddService = () => {
    if (newService.id && newService.price) {
      if (editingIndex !== null) {
        const updatedServices = [...userServices];
        updatedServices[editingIndex] = newService;
        setUserServices(updatedServices);
        setEditingIndex(null);
        setNewService({ id: "", name: "", price: "" });
      } else {
        setUserServices([...userServices, { ...newService }]);
        setNewService({ id: "", name: "", price: "" });
      }
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
      console.log("Services before submission:", userServices);
      console.log("Addresses before submission:", addresses);
      console.log("Vendor data before submission:", vendorData);

      // Validate address proof fields
      const hasAddressProof =
        vendorData.aadhaar ||
        vendorData.drivingLicense ||
        vendorData.voterId ||
        vendorData.passportNumber;
      if (!hasAddressProof) {
        setError("addressProof", {
          type: "manual",
          message: "At least one address proof is required.",
        });
        setloading(false);
        return;
      }

      const form = new FormData();
      form.append("name", data.name);
      form.append("organizationType_id", data.organizationType_id);
      form.append("googleCoordinates", JSON.stringify(data.googleCoordinates));
      form.append("mobile", data.mobile);
      form.append("whatsapp", data.whatsapp);
      form.append("email", data.email);
      form.append("description", data.description);
      form.append("designation", data.designation);
      form.append("businessName", data.businessName);
      form.append("registrationId", data.registrationId);
      form.append("bankName", data.bankName);
      form.append("accountNumber", data.accountNumber);
      form.append("accountHolder", data.accountHolder);
      form.append("ifscCode", data.ifscCode);
      form.append("upiId", data.upiId);
      form.append("googlemaplink", data.googlemaplink);
      form.append("beneficiary_id", data.beneficiary_id);

      form.append("services", JSON.stringify(userServices));
      form.append("addresses", JSON.stringify(addresses));
      form.append("vendorData", JSON.stringify(vendorData));

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
      form.append("fileextras", imageExtra);

      const maxSize = 1 * 1024 * 1024;
      const oversizedImages = PImages.filter((file) => file.size > maxSize);

      if ((PImages.length + imageExtra.length) > 3) {
        toast.dismiss();
        toast.error('Exceeded the maximum number of images');
        return;
      } else if (oversizedImages.length > 0) {
        toast.dismiss();
        toast.error('Each image must be less than 1MB.');
        return;
      } else {
        const response = await api.post("api/organization/upsert", form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setTimeout(() => {
          if (response.status === 201 || response.status === 200) {
            Swal.fire({
              text: mode1 === "edit" ? "Organization Updated Successfully" : "Organization Added Successfully",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
              willClose: () => {
                // navigate("/organizationlist");
              },
            });
          }
        }, 2000);
      }
    } catch (error) {
      Swal.fire({
        text: error.response?.data?.error || "An error occurred. Please try again.",
        icon: "error",
      });
      console.error("Form submission error:", error);
    } finally {
      setloading(false);
    }
  };

  async function handleOrginazationtypeid(id) {
    try {
      const filteredList = orgType.filter((data) => data.value === id);
      setServicesList(filteredList);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (orgTypeEditId) {
      handleOrginazationtypeid(orgTypeEditId);
    }
  }, [orgTypeEditId]);

  // Watch accountType and address proof fields
  const accountType = watch("vendorData.accountType");
  const aadhaar = watch("vendorData.aadhaar");
  const drivingLicense = watch("vendorData.drivingLicense");
  const voterId = watch("vendorData.voterId");
  const passportNumber = watch("vendorData.passportNumber");

  // Validate address proof fields
  useEffect(() => {
    const hasAddressProof = aadhaar || drivingLicense || voterId || passportNumber;
    if (hasAddressProof) {
      clearErrors("addressProof");
    } else {
      setError("addressProof", {
        type: "manual",
        message: "At least one address proof is required.",
      });
    }
  }, [aadhaar, drivingLicense, voterId, passportNumber, setError, clearErrors]);

  return (
    <div>
      {isLoading || isDataLoading ? (
        <Loader />
      ) : (
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                      <p className="text-red-500 mt-2 text-xs">
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
                    <div className="flex flex-col p-1 mt-[-5px]">
                      <label htmlFor="google-coordinates" className="block text-xs font-medium">
                        Google Coordinates*
                      </label>
                      <div className="flex gap-2">
                        <InputField
                          type={"text"}
                          placeholder={"Latitude"}
                          {...register("googleCoordinates.latitude", {
                            required: "Latitude is required.",
                            pattern: {
                              value: latitudeRegex,
                              message: "Please enter a valid latitude (-90 to 90).",
                            },
                          })}
                          onChange={(e) => {
                            setValue("googleCoordinates.latitude", e.target.value);
                            trigger("googleCoordinates.latitude");
                          }}
                          readOnly={mode1}
                        />
                        <InputField
                          type={"text"}
                          placeholder={"Longitude"}
                          {...register("googleCoordinates.longitude", {
                            required: "Longitude is required.",
                            pattern: {
                              value: longitudeRegex,
                              message: "Please enter a valid longitude (-180 to 180).",
                            },
                          })}
                          onChange={(e) => {
                            setValue("googleCoordinates.longitude", e.target.value);
                            trigger("googleCoordinates.longitude");
                          }}
                          readOnly={mode1}
                        />
                      </div>
                      {errors.googleCoordinates?.longitude && (
                        <p className="text-red-500 text-xs">
                          {errors.googleCoordinates?.longitude.message}
                        </p>
                      )}
                      {errors.googleCoordinates?.latitude && (
                        <p className="text-red-500 text-xs">
                          {errors.googleCoordinates?.latitude.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Controller
                      name="googlemaplink"
                      control={control}
                      defaultValue=""
                      rules={{ required: "Google Map Link is required." }}
                      render={({ field }) => (
                        <InputField
                          label={"Google Map Link*"}
                          type={"text"}
                          placeholder={"Enter Google Map Link"}
                          {...field}
                          readOnly={mode1}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            trigger("googlemaplink");
                          }}
                        />
                      )}
                    />
                    {errors.googlemaplink && (
                      <p className="text-red-500 text-xs">
                        {errors.googlemaplink.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Controller
                      name="mobile"
                      control={control}
                      defaultValue=""
                      rules={{ required: "Mobile number is required." }}
                      render={({ field }) => (
                        <PhoneNumberInput
                          label={"Mobile Number*"}
                          {...field}
                          defaultCountry={"IN"}
                          placeholder={"Enter Mobile Number"}
                          className="p-1"
                          readOnly={mode1}
                          onChange={(value) => {
                            field.onChange(value);
                            if (value && value.length < 10) {
                              setError("mobile", {
                                type: "manual",
                                message: "Mobile number must be at least 10 digits.",
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

                  <div>
                    <Controller
                      name="whatsapp"
                      control={control}
                      defaultValue=""
                      rules={{ required: "WhatsApp number is required." }}
                      render={({ field }) => (
                        <WhatsAppInput
                          label={"WhatsApp Number*"}
                          {...field}
                          className="p-1"
                          readOnly={mode1}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            field.onChange(value);
                            if (value.length > 10) {
                              setError("whatsapp", {
                                type: "manual",
                                message: "WhatsApp number cannot exceed 10 digits.",
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
                      {...register("email", {
                        required: "Email is required.",
                        pattern: {
                          value: emailRegex,
                          message: "Please enter a valid email address.",
                        },
                      })}
                      readOnly={mode1}
                      onChange={(e) => {
                        setValue("email", e.target.value);
                        trigger("email");
                      }}
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

                  {watch("organizationType_id") === dentistId && (
                    <div>
                      <InputField
                        label="Registration ID*"
                        type="text"
                        placeholder="Enter Registration ID"
                        {...register("registrationId", {
                          required: "Registration ID is required.",
                        })}
                        readOnly={mode1}
                      />
                      {errors.registrationId && (
                        <p className="text-red-500 text-xs">
                          {errors.registrationId.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="">
                  <h3 className="text-lg font-semibold mb-4">Addresses</h3>
                  <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
                    <div className="w-full sm:w-2/3">
                      <input
                        type="text"
                        placeholder="Enter Address"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        readOnly={mode1 === "view"}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#660F5D]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <span
                        onClick={handleAddAddress}
                        className={`px-4 py-1 rounded-md ${
                          mode1 === "view"
                            ? "bg-gray-400 text-white cursor-not-allowed pointer-events-none"
                            : "bg-[#660F5D] text-white cursor-pointer"
                        }`}
                      >
                        {editingIndex2 !== null ? "Save" : "Add"}
                      </span>
                      <span
                        onClick={handleClearAddress}
                        className={`px-7 py-1 border rounded-md ${
                          mode1 !== "view"
                            ? "bg-white text-gray-700 border-gray-700 cursor-pointer"
                            : "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed pointer-events-none"
                        }`}
                      >
                        Clear
                      </span>
                    </div>
                  </div>
                  <hr />
                  <div className="space-y-4">
                    {addresses.map((address, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row items-center gap-4 p-4"
                      >
                        <input
                          type="text"
                          value={address}
                          readOnly
                          className="flex-1 px-3 py-2 border rounded-md bg-white"
                        />
                        <span
                          onClick={() => handleEditAddress(index)}
                          className={`px-4 py-2 rounded-md ${
                            mode1 !== "view"
                              ? "bg-[#FAFAFA] text-[#660F5D] cursor-pointer"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none"
                          }`}
                        >
                          Edit
                        </span>
                        <span
                          onClick={() => handleDeleteAddress(index)}
                          className={`px-4 py-2 border rounded-md ${
                            mode1 !== "view"
                              ? "bg-white border-gray-700 text-gray-700 cursor-pointer"
                              : "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed pointer-events-none"
                          }`}
                        >
                          Delete
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

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
                        required: "Bank name is required.",
                        pattern: {
                          value: bankRegex,
                          message: "Enter a valid Bank Name (only letters and spaces).",
                        },
                      })}
                      onChange={(e) => {
                        setValue("bankName", e.target.value);
                        trigger("bankName");
                      }}
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
                        required: "Account number is required.",
                        pattern: {
                          value: AccountNumberRegex,
                          message: "Enter a valid account number (8-18 digits).",
                        },
                      })}
                      onChange={(e) => {
                        setValue("accountNumber", e.target.value);
                        trigger("accountNumber");
                      }}
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
                        pattern: {
                          value: accountHolderRegex,
                          message: "Enter a valid name (only letters and spaces).",
                        },
                      })}
                      onChange={(e) => {
                        setValue("accountHolder", e.target.value);
                        trigger("accountHolder");
                      }}
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
                  <div>
                    <InputField
                      label={"CashFree Vendor ID*"}
                      type={"text"}
                      placeholder={"Enter Vendor ID"}
                      {...register("beneficiary_id")}
                      readOnly={mode1}
                    />
                    {errors.beneficiary_id && (
                      <p className="text-red-500 text-xs">
                        {errors.beneficiary_id.message}
                      </p>
                    )}
                  </div>
                </div>

                {watch("organizationType_id") !== dentistId && (
                  <div>
                    <h3 className="text-lg font-bold mb-4 mt-6">
                      Business Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">Account Type*</label>
                        <Controller
                          name="vendorData.accountType"
                          control={control}
                          defaultValue=""
                          rules={{ required: "Account Type is required." }}
                          render={({ field }) => (
                            <Select
                              isDisabled={mode1 === "view"}
                              value={
                                field.value
                                  ? { value: field.value, label: field.value }
                                  : null
                              }
                              onChange={(selectedOption) => {
                                const value = selectedOption ? selectedOption.value : "";
                                field.onChange(value);
                                setVendorData((prev) => ({ ...prev, accountType: value }));
                              }}
                              options={[
                                { value: "Individual", label: "Individual" },
                                { value: "Business", label: "Business" },
                              ]}
                              placeholder="Select Account Type"
                              className="text-[12px]"
                              styles={{
                                control: (base, { isFocused }) => ({
                                  ...base,
                                  border: isFocused
                                    ? "2px solid #660F5D"
                                    : "1px solid #EAEAFF",
                                  boxShadow: isFocused ? "none" : "none",
                                  borderRadius: "5px",
                                  padding: "2px",
                                  fontSize: "12px",
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
                          )}
                        />
                        {errors.vendorData?.accountType && (
                          <p className="text-red-500 text-xs">
                            {errors.vendorData.accountType.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <InputField
                          label={"PAN*"}
                          type={"text"}
                          placeholder={"Enter PAN"}
                          {...register("vendorData.pan", {
                            required: "PAN is required.",
                            pattern: {
                              value: panRegex,
                              message: "Enter a valid PAN (e.g., ABCDE1234F).",
                            },
                          })}
                          readOnly={mode1}
                          onChange={(e) => {
                            setValue("vendorData.pan", e.target.value);
                            setVendorData((prev) => ({ ...prev, pan: e.target.value }));
                            trigger("vendorData.pan");
                          }}
                        />
                        {errors.vendorData?.pan && (
                          <p className="text-red-500 text-xs">
                            {errors.vendorData.pan.message}
                          </p>
                        )}
                      </div>
                      {accountType === "Business" && (
                        <>
                          <div>
                            <InputField
                              label={"GST"}
                              type={"text"}
                              placeholder={"Enter GST"}
                              {...register("vendorData.gst")}
                              readOnly={mode1}
                              onChange={(e) => {
                                setValue("vendorData.gst", e.target.value);
                                setVendorData((prev) => ({ ...prev, gst: e.target.value }));
                              }}
                            />
                          </div>
                          <div>
                            <InputField
                              label={"CIN"}
                              type={"text"}
                              placeholder={"Enter CIN"}
                              {...register("vendorData.cin")}
                              readOnly={mode1}
                              onChange={(e) => {
                                setValue("vendorData.cin", e.target.value);
                                setVendorData((prev) => ({ ...prev, cin: e.target.value }));
                              }}
                            />
                          </div>
                        </>
                      )}
                      <div>
                        <InputField
                          label={"Aadhaar"}
                          type={"text"}
                          placeholder={"Enter Aadhaar"}
                          {...register("vendorData.aadhaar")}
                          readOnly={mode1}
                          onChange={(e) => {
                            setValue("vendorData.aadhaar", e.target.value);
                            setVendorData((prev) => ({ ...prev, aadhaar: e.target.value }));
                            trigger("vendorData.aadhaar");
                          }}
                        />
                      </div>
                      <div>
                        <InputField
                          label={"Driving License"}
                          type={"text"}
                          placeholder={"Enter Driving License"}
                          {...register("vendorData.drivingLicense")}
                          readOnly={mode1}
                          onChange={(e) => {
                            setValue("vendorData.drivingLicense", e.target.value);
                            setVendorData((prev) => ({ ...prev, drivingLicense: e.target.value }));
                            trigger("vendorData.drivingLicense");
                          }}
                        />
                      </div>
                      <div>
                        <InputField
                          label={"Voter ID"}
                          type={"text"}
                          placeholder={"Enter Voter ID"}
                          {...register("vendorData.voterId")}
                          readOnly={mode1}
                          onChange={(e) => {
                            setValue("vendorData.voterId", e.target.value);
                            setVendorData((prev) => ({ ...prev, voterId: e.target.value }));
                            trigger("vendorData.voterId");
                          }}
                        />
                      </div>
                      <div>
                        <InputField
                          label={"Passport Number"}
                          type={"text"}
                          placeholder={"Enter Passport Number"}
                          {...register("vendorData.passportNumber")}
                          readOnly={mode1}
                          onChange={(e) => {
                            setValue("vendorData.passportNumber", e.target.value);
                            setVendorData((prev) => ({ ...prev, passportNumber: e.target.value }));
                            trigger("vendorData.passportNumber");
                          }}
                        />
                      </div>
                    </div>
                    {errors.addressProof && (
                      <p className="text-red-500 text-xs mt-2">
                        {errors.addressProof.message}
                      </p>
                    )}
                  </div>
                )}

                {watch("organizationType_id") !== dentistId && (
                  <div className="">
                    <h3 className="text-lg font-semibold mb-4">Services</h3>
                    <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
                      <div className="w-full sm:w-1/2">
                        <Select
                          isDisabled={mode1 === "view"}
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
                              fontSize: "12px",
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
                            className={`px-4 py-1 rounded-md ${
                              mode1 === "view"
                                ? "bg-gray-400 text-white cursor-not-allowed pointer-events-none"
                                : "bg-[#660F5D] text-white cursor-pointer"
                            }`}
                          >
                            Add
                          </span>
                        ) : (
                          <span
                            onClick={handleAddService}
                            className={`px-4 py-1 rounded-md ${
                              mode1 === "view"
                                ? "bg-gray-400 text-white cursor-not-allowed pointer-events-none"
                                : "bg-[#660F5D] text-white cursor-pointer"
                            }`}
                          >
                            Save
                          </span>
                        )}
                        <span
                          onClick={() => setNewService({ name: "", price: "" })}
                          className={`px-7 py-1 border rounded-md ${
                            mode1 !== "view"
                              ? "bg-white text-gray-700 border-gray-700 cursor-pointer"
                              : "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed pointer-events-none"
                          }`}
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
                            className={`px-4 py-2 rounded-md ${
                              mode1 !== "view"
                                ? "bg-[#FAFAFA] text-[#660F5D] cursor-pointer"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none"
                            }`}
                          >
                            Edit
                          </span>
                          <span
                            onClick={() => handleDeleteService(index)}
                            className={`px-4 py-2 border rounded-md ${
                              mode1 !== "view"
                                ? "bg-white border-gray-700 text-gray-700 cursor-pointer"
                                : "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed pointer-events-none"
                            }`}
                          >
                            Delete
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <Controller
                    name="file1"
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                      <FileUpload
                        name="file1"
                        label="Choose file for profile*"
                        multiple={false}
                        readOnly={mode1}
                        onChange={handleChange}
                      />
                    )}
                  />
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
                        setFiles={setFiles}
                        files={files}
                      />
                    )}
                  />
                  {organization?.file2 && (
                    <div className="flex gap-3">
                      {organization?.file2.map((item, index) => (
                        <div key={index} className="mt-2 w-[50px] h-[50px] relative">
                          <img
                            src={item}
                            alt="Existing"
                            className="w-full h-full rounded-md object-cover"
                          />
                          {mode1 !== "view" && (
                            <span
                              onClick={() => handleDeleteImage(index)}
                              className="absolute cursor-pointer top-[-5px] right-[-5px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                            >
                              ✕
                            </span>
                          )}
                        </div>
                      ))}
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
                          colors={["white", "white", "white", "white", "white", "white"]}
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
      )}
      <Toaster position="top-right" reverseOrder={false} toastOptions={{ duration: 2000 }} />
    </div>
  );
};

export default CreateOrganization;