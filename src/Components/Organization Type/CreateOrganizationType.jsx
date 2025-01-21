import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"; // Import useForm hook
import Header from '../../common/Header';
import PageNavigation from '../../common/PageNavigation';
import { InputField } from '../../common/Input_fileds';
import Submit from '../../common/Submit';

const CreateOrganizationType = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm(); // Initialize useForm
  
  const handleBackClick = () => {
    navigate(-1); // Go to the previous page
  };

  const onSubmit = (data) => {
    // Add form submission logic here
    console.log(data); // Log the form data for now
  };

  return (
    <div className="create-organization-type-container flex flex-col min-h-screen bg-gray-100">
      <Header name={"Organization Types"} />
      <PageNavigation title={"Create Organization Type"} onBackClick={handleBackClick} />

      <div className="create-organization-form-container flex-1 bg-white px-6 py-4 rounded-lg shadow-md mx-4 mb-4">
        <form className="organization-form-container space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <h3 className="form-title p-2 font-bold">Create Organization Type</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <InputField
              label="Organization Type"
              type="text"
              placeholder="Enter Organization Type Name"
              {...register("organizationType", { required: "Organization Type is required" })}
              error={errors.organizationType}
              className="focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D] p-2"
            />
            <InputField
              label="Description"
              type="text"
              placeholder="Enter Description"
              {...register("description", { required: "Description is required" })}
              error={errors.description}
              className="focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D] p-2"
            />
            <InputField
              label="From Date"
              type="date"
              {...register("fromDate", { required: "From Date is required" })}
              error={errors.fromDate}
              className="focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D] p-2"
            />
            <InputField
              label="To Date"
              type="date"
              {...register("toDate", { required: "To Date is required" })}
              error={errors.toDate}
              className="focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D] p-2"
            />
          </div>

          {/* Submit Button */}
          <Submit />
        </form>
      </div>
    </div>
  );
};

export default CreateOrganizationType;
