import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../../common/Header";
import PageNavigation from "../../common/PageNavigation";
import { InputField } from "../../common/Input_fileds";
import Submit from "../../common/Submit";
import TickSquare from "../../assets/images/TickSquare.svg"; // Import the success icon

const CreateService = () => {
  const navigate = useNavigate();
  
  const handleBackClick = () => {
    navigate(-1); // Go to the previous page
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    Swal.fire({
      text: "Service added successfully",
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
        navigate("/services"); // Redirect to the services page after the popup closes
      },
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <Header name={"Services"} />

      {/* Page Navigation */}
      <PageNavigation title={"Create Service"} onBackClick={handleBackClick} />

      {/* Card Container */}
      <div className="bg-white shadow-lg rounded-lg p-3 mt-0 border">
        <h3 className="form-title p-2 font-bold">Create Service</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Service Name */}
            <div>
              <InputField
                label={"Service Name"}
                type={"text"}
                placeholder={"Enter Service Name"}
                className="w-full focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D] p-2"
              />
            </div>

            {/* Service Description */}
            <div>
              <InputField
                label={"Service Description"}
                type={"text"}
                placeholder={"Enter Service Description"}
                className="w-full focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D] p-2"
              />
            </div>

            {/* From Date */}
            <div>
              <InputField
                label={"From Date"}
                type={"date"}
                className="w-full focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D] p-2"
              />
            </div>

            {/* To Date */}
            <div>
              <InputField
                label={"To Date"}
                type={"date"}
                className="w-full focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D] p-2"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-4">
            <Submit />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateService;
