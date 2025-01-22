import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Swal from "sweetalert2"; 
import {
  InputField,
  SelectField,
  PhoneNumberInput,
  WhatsAppInput,
} from "../../common/Input_fileds";
import Header from "../../common/Header";
import Submit from "../../common/Submit";
import PageNavigation from "../../common/PageNavigation";
import './Createuser.css'
import TickSquare from '../../assets/images/TickSquare.svg'

const CreateUserPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsAppNumber, setWhatsAppNumber] = useState("");
  const [roles, setRoles] = useState(""); 
  const [designationOptions, setDesignationOptions] = useState([]); 
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); 
  };

  const handleRoleChange = (selectedRole) => {
    setRoles(selectedRole);

    
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
          { value: "Oral Medicine & RadiologistLab", label: "Oral Medicine & Radiologist" },
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
      case "Radiology center":
        setDesignationOptions([
          { value: "Owner", label: "Owner" },
          { value: "Technician", label: "Technician" },
        ]);
        break;
      case "Material Suplier":
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

  const handleSubmit = (event) => {
    event.preventDefault();
    Swal.fire({ 
      text:"user added successfully",
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
  return (
    <div className="createuser-page-container flex flex-col min-h-screen bg-gray-100">
      
      <Header name="Organization" />
      <PageNavigation
        title={"Create User"}
        onBackClick={handleBackClick}
      />

      
      <div className="create-user-form-container flex-1 bg-white px-6 py-4 rounded-lg shadow-md mx-4 mb-4">
        <form className="user-form-container space-y-4" onSubmit={handleSubmit}>
          
          <h3 className="form-title p-2 font-bold">Create user</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SelectField
              label="Prefix*"
              options={[{ value: "Mr", label: "Mr" }, { value: "Mrs", label: "Mrs" }]}
              className="focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D]" 
            />
            <SelectField
              label="Roles"
              options={[ 
                { value: "Roles", label: "Roles" }, 
                { value: "Dentist", label: "Dentist" }, 
                { value: "Dental Laboratory", label: "Dental Laboratory" }, 
                { value: "Radiology center", label: "Radiology center" }, 
                { value: "Material Suplier", label: "Material Suplier" },
              ]}
              onChange={(e) => handleRoleChange(e.target.value)} // Handle role change
              className="focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D]"
            />
            <InputField
              label="First Name"
              type="text"
              placeholder="Enter First name"
              className="focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D]"
            />
            <InputField
              label="Last Name"
              type="text"
              placeholder="Enter Last name"
              className="focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D]"
            />
          </div>

          {/* Grid for Date of Birth, Email, Phone and WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <InputField
              label="Date of Birth"
              type="date"
              className="focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D]"
            />
            <InputField
              label="Email"
              type="email"
              placeholder="Enter email"
              className="focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D]"
            />
            <PhoneNumberInput
              label="Mobile Number"
              value={phoneNumber}
              onChange={setPhoneNumber}
              defaultCountry="IN"
              className="focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D]"
            />
            <WhatsAppInput
              label="WhatsApp Number"
              value={whatsAppNumber}
              onChange={(e) => setWhatsAppNumber(e.target.value)}
              className="focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D]"
            />
          </div>

          {/* Grid for Business Name, Registration Id, and Designation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SelectField
              label="Designation"
              options={designationOptions} // Dynamic designation options based on role
              className="focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D]"
            />
            <InputField
              label="Organization"
              type="text"
              placeholder="Organization"
              className="focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D]"
            />
          </div>

          {/* Submit Button */}
          <Submit />
        </form>
      </div>
    </div>
  );
};

export default CreateUserPage;
