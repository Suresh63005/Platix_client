import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form"; // Import useForm hook
import Header from "../../common/Header";
import PageNavigation from "../../common/PageNavigation";
import { InputField } from "../../common/Input_fileds";
import TickSquare from "../../assets/images/TickSquare.svg"; // Import the success icon
import axios from "axios"; // Import axios for making API requests

const CreateService = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { id, mode: initialMode } = location.state || {};
  const mode = initialMode || "create";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    // if (id) {
    //   const service = servicesData.find((service) => service.id === id);
    //   if (service) {
    //     reset({
    //       name: service.name,
    //       description: service.description,
    //       fromdate: service.fromdate,
    //       todate: service.todate,
    //     });
    //   }
    // }
  }, [id, reset]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const onSubmit = async (data) => {
    const {name,description,fromdate,todate} = data
    try {
      const response = mode === "edit" 
        ? await axios.put(`http://localhost:5000/admin/createservice/${id}`, data)
        : await axios.post("http://localhost:5000/admin/createservice", data);
        
      console.log("API response:", response);  // Log the response to see if it's successful
  
      Swal.fire({
        text: mode === "edit" ? "Service updated successfully" : "Service created successfully",
        imageUrl: TickSquare,
        imageWidth: 50,
        imageHeight: 50,
        background: "white",
        color: "black",
        showConfirmButton: false,
        timer: 1500,
        willClose: () => {
          navigate("/services");
        },
      });
    } catch (error) {
      console.error("Error creating/updating service:", error);
      Swal.fire({
        text: "An error occurred. Please try again.",
        icon: "error",
        showConfirmButton: true,
      });
    }
  };
  

  return (
    <div className="bg-gray-100 h-full">
      {/* Header */}
      <Header name={"Services"} />

      {/* Page Navigation */}
      <PageNavigation
        title={mode === "edit" ? "Edit Service" : mode === "view" ? "View Service" : "Create Service"}
        onBackClick={handleBackClick}
      />

      {/* Form Card */}
      <div className="bg-white shadow-lg rounded-lg p-4 mt-0 m-[12px] border">
        <h3 className="form-title p-2 pb-3 font-bold">
          {mode === "edit" ? "Edit Service" : mode === "view" ? "View Service" : "Create Service"}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Service Name */}
            <InputField
              label="Service Name"
              type="text"
              placeholder="Enter Service Name"
              {...register("name", { required: "Service Name is required" })}
              error={errors.name}
              readOnly={mode === "view"}
            />

            {/* Service Description */}
            <InputField
              label="Service Description"
              type="text"
              placeholder="Enter Service Description"
              {...register("description", { required: "Description is required" })}
              error={errors.description}
              readOnly={mode === "view"}
            />

            {/* From Date */}
            <InputField
              label="From Date"
              type="date"
              {...register("fromdate", { required: "From Date is required" })}
              error={errors.fromdate}
              readOnly={mode === "view"}
            />

            {/* To Date */}
            <InputField
              label="To Date"
              type="date"
              {...register("todate", { required: "To Date is required" })}
              error={errors.todate}
              readOnly={mode === "view"}
            />
          </div>

          {/* Submit and Cancel Buttons */}
          {mode !== "view" && (
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="reset"
                className="flex items-center bg-white text-gray-500 px-4 py-1 rounded-md border border-gray-300 text-sm"
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
  );
};

export default CreateService;
