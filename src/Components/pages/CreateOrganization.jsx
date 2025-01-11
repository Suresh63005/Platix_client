import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert
import UserServices from "../../common/UserServices";
import {
  InputField,
  SelectField,
  WhatsAppInput,
  PhoneNumberInput,
  FileUpload
} from "../../common/Input_fileds";
import Submit from "../../common/Submit";
import Header from "../../common/Header";
import PageNavigation from "../../common/PageNavigation";
import TickSquare from '../../assets/images/TickSquare.svg'

const CreateOrganization = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsAppNumber, setWhatsAppNumber] = useState("");
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // SweetAlert after form submission
    Swal.fire({ 
      text: "Organization created successfully",
      imageUrl: TickSquare, // Add image for success icon
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
        // Navigate to the organization list page after success message
        navigate("/organizationlist"); 
      },
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Static Header and Navigation */}
      <div className="bg-white">
        <Header name={"Organization"} />
        <PageNavigation title={"Create Organization"} onBackClick={handleBackClick} />
      </div>

      {/* Scrollable Form and Services Section */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="form-title text-lg font-bold mb-4">Create Organization</h3>

          {/* Form Section */}
          <form className="grid gap-4" onSubmit={handleSubmit}> {/* Decrease gap between rows */}
  {/* Form Row 1 */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"> {/* Adjust column gap */}
    <InputField
      label={"Organization Name"}
      type={"text"}
      placeholder={"Enter Organization Name"}
      className="p-1" /* Reduced padding for tighter spacing */
    />
    <SelectField
      label="Organization Type"
      options={[
        { value: "", label: "Select Role" },
        { value: "Dentist", label: "Dentist" },
        { value: "Radiology", label: "Radiology" }
      ]}
      className="p-1"
    />
    <InputField
      label={"Address"}
      type={"text"}
      placeholder={"Enter Address"}
      className="p-1"
    />
    <div className="flex flex-col p-1 mt-[-5px]">
      <label htmlFor="google-coordinates" className="block text-xs font-medium">
        Google Coordinates
      </label>
      <div className="flex gap-2"> {/* Adjusted spacing between longitude and latitude inputs */}
        <InputField type={"text"} placeholder={"Longitude"} className="p-1"/>
        <InputField type={"text"} placeholder={"Latitude"} className="p-1" />
      </div>
    </div>
  </div>

  {/* Form Row 2 */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
    <PhoneNumberInput
      value={phoneNumber}
      onChange={setPhoneNumber}
      defaultCountry="US"
      label={"Phone Number"}
      className="p-1"
    />
    <WhatsAppInput
      label={"WhatsApp Number"}
      value={whatsAppNumber}
      onChange={(e) => setWhatsAppNumber(e.target.value)}
      className="p-1"
    />
    <InputField label="Email" type="email" placeholder="Enter Email" className="p-1" />
    <InputField label="Business Name" type="text" placeholder="Enter Business Name" className="p-1" />
  </div>

  {/* Form Row 3 */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
    <InputField label="GST" type="text" placeholder="Enter GST Number" className="p-1" />
    <SelectField
      label="Designation"
      options={[
        { value: "Dentist", label: "Dentist" },
        { value: "Radiology", label: "Radiology" }
      ]}
      className="p-1"
    />
  </div>

  <FileUpload className="p-1" />
  <Submit className="p-1" />
</form>
        </div>

        {/* User Services Component */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <UserServices />
        </div>
      </div>
    </div>
  );
};

export default CreateOrganization;
