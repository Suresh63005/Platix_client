import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
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
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

const CreateOrganization = () => {
  const location = useLocation();
  // const id=location.state ? location.state.id : null;
  const navigate = useNavigate();
  const { id, mode: initialMode } = location.state || {};
  // console.log(id)
  const [mode, setMode] = useState(initialMode || "create");
  const [organization, setOrganization] = useState(null);
  const { register, handleSubmit, setValue, watch, control, reset } = useForm();
  const [PImages, setPImages] = useState([]);
  const [formData, setFormData] = useState({ id: id || null, address: '', businessName: null, file1: null,file2:null,imgPreview:null,description:'',designation:'',email:'',googleCoordinates:{latitude:'',longitude:''},gstNumber:null,mobile:'',name:'',registrationId:null,type:'',whatsapp:'' });

  useEffect(() => {
    if (id && (mode === "edit" || mode === "view")) {
      axios.get(`http://localhost:5000/api/organization/getby/${id}`)
        .then((response) => {
          const orgData = response.data.data;
          // console.log(orgData)
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
        })
        .catch((error) => console.error("Error fetching organization data:", error));
    } else {
      setMode("create"); 
    }
  }, [id, mode, setValue]);
  

  useEffect(() => {
    if (id) {
      const org = organizationsData.find((org) => org.id === id);
      setOrganization(org);
      reset(org);
    }
  }, [id, reset]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
      setValue(name, files[0]); 
    }
  };
  
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setPImages(files);
    setValue("file2", files); 
  };  
  
  const onSubmit = async (data) => {
    try {
      console.log("Form Data Submitted:", data);
      const form = new FormData();
      form.append('name', data.name);
      form.append('type', data.type);
      form.append('address', data.address);
      form.append('googleCoordinates', JSON.stringify(data.googleCoordinates));
      form.append('mobile', data.mobile);
      form.append('whatsapp', data.whatsapp);
      form.append('email', data.email);
      form.append('description', data.description);
      form.append('gstNumber', data.gstNumber);
      form.append('designation', data.designation);
      form.append('businessName', data.businessName);
      form.append('registrationId', data.registrationId);
      form.append('bankName', data.bankName);  // Bank Name
      form.append('accountNumber', data.accountNumber);  // Account Number
      form.append('accountHolder', data.accountHolder);  // Account Holder Name
      form.append('ifscCode', data.ifscCode);  // IFSC Code
      form.append('upiId', data.upiId);  // UPI ID
  
      if (id) {
        form.append('id', id);
      }
  
      // Append single file (file1)
      if (data.file1) {
        form.append('file1', data.file1);  // Single file
      }
      
      if (PImages.length > 0) {
        PImages.forEach((file, index) => {
          form.append(`file2`, file);      // Multiple files under the same key
        });
      }    
  
      // Send the data via axios
      const response = await axios.post('http://localhost:5000/api/organization/upsert', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 201) {
        Swal.fire({
          text: mode === 'edit' ? 'Organization Updated Successfully' : 'Organization Added Successfully',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
        reset();
      }
    } catch (error) {
      Swal.fire({
        text: 'Error submitting the form.',
        icon: 'error',
      });
      console.error('Form submission error:', error);
    }
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
                readOnly={mode === "view"}
              />
              
              <Controller
                name="type"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <SelectField
                    label="Organization Type"
                    defaultplaceholder={"Select Role"}
                    options={[
                      { value: "Dentist", label: "Dentist" },
                      { value: "Radiology", label: "Radiology" },
                      { value: "Material Supplier", label: "Material Supplier" },
                      { value: "Dental Laboratory", label: "Dental Laboratory" },
                    ]}
                    value={field.value}
                    onChange={field.onChange} // Pass onChange to the SelectField component
                    className="p-1 w-full"
                    readOnly={mode === "view"}
                  />
                )}
              />

              
              <InputField
                label={"Address"}
                type={"text"}
                placeholder={"Enter Address"}
                {...register("address")}
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
                    disabled={mode === "view"}
                  />
                  <InputField
                    type={"text"}
                    placeholder={"Longitude"}
                    {...register("googleCoordinates.longitude")}
                    disabled={mode === "view"}
                  />
                </div>
              </div>
              
              <Controller
                name="mobile"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <PhoneNumberInput
                    label={"Mobile Number"}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    defaultCountry={"IN"}
                    className="p-1"
                    disabled={mode === "view"}
                  />
                )}
              />
              
              <Controller
                name="whatsapp"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <WhatsAppInput
                    label={"WhatsApp Number"}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="p-1"
                    disabled={mode === "view"}
                  />
                )}
              />
              
              <InputField
                label={"Email"}
                type={"email"}
                placeholder={"Enter Email"}
                {...register("email")}
                disabled={mode === "view"}
              />
              
              <InputField
                label={"Description"}
                type={"text"}
                placeholder={"Enter Description"}
                {...register("description")}
                disabled={mode === "view"}
              />
            </div>

            {watch("type") !== "Dentist" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <InputField
                  label="GST"
                  type="text"
                  placeholder="Enter GST Number"
                  {...register("gstNumber")}
                  disabled={mode === "view"}
                />
                <Controller
                  name="designation"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <SelectField
                      label="Designation"
                      defaultplaceholder={"Select Designation"}
                      options={[
                        { value: "Owner", label: "Owner" },
                        { value: "Technician", label: "Technician" },
                        { value: "Delivery Boy", label: "Delivery Boy" },
                      ]}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      className="p-1"
                      disabled={mode === "view"}
                    />
                  )}
                />
              </div>
            )}

            {watch("type") === "Dentist" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <InputField
                  label="Business Name"
                  type="text"
                  placeholder="Enter Business Name"
                  {...register("businessName")}
                  disabled={mode === "view"}
                />
                <InputField
                  label="Registration ID"
                  type="text"
                  placeholder="Enter Registration ID"
                  {...register("registrationId")}
                  disabled={mode === "view"}
                />
                <Controller
                  name="designation"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
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
                        { value: "Oral Medicine & Radiologist", label: "Oral Medicine & Radiologist" },
                        { value: "Community dentist", label: "Community dentist" },
                        { value: "Paeddontist", label: "Paeddontist" },
                      ]}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      className="p-1"
                      disabled={mode === "view"}
                    />
                  )}
                />
              </div>
            )}
            {/* Organization Account Details */}
            <h3 className="text-lg font-bold mb-4 mt-6">Organization Account Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <InputField label={"Bank Name"} type={"text"} placeholder={"Enter Bank Name"} {...register("bankName")} disabled={mode === "view"} />
              <InputField label={"Organization Account Number"} type={"text"} placeholder={"Enter Account Number"} {...register("accountNumber")} disabled={mode === "view"} />
              <InputField label={"Account Holder Name"} type={"text"} placeholder={"Enter Account Holder Name"} {...register("accountHolder")} disabled={mode === "view"} />
              <InputField label={"IFSC Code"} type={"text"} placeholder={"Enter IFSC Code"} {...register("ifscCode")} disabled={mode === "view"} />
              <InputField label={"UPI ID"} type={"text"} placeholder={"Enter UPI ID"} {...register("upiId")} disabled={mode === "view"} />
            </div>
            {(watch("type") === "Radiology" ||
          watch("type") === "Material Supplier" ||
          watch("type") === "Dental Laboratory") && (
          <div className="">
            <UserServices />
          </div>
        )}
            <Controller
              name="file1"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <FileUpload
                  name="file1"
                  multiple={false}
                  onChange={handleChange}
                />
              )}
            />

            <Controller
              name="file2"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <FileUpload
                  name="file2"
                  multiple={true}
                  onChange={handleImageUpload}
                />
              )}
            />

            
            {mode !== "view" && (
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="reset"
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

export default CreateOrganization;
