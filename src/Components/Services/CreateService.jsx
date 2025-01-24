import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form"; // Import useForm hook
import Header from "../../common/Header";
import PageNavigation from "../../common/PageNavigation";
import { InputField } from "../../common/Input_fileds";
import TickSquare from "../../assets/images/TickSquare.svg"; // Import the success icon
import { servicesData } from "../../Data/data";

const CreateService = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { id, mode: initialMode } = location.state || {};
  const [mode, setMode] = useState(initialMode || "create");

  const { register, handleSubmit, setValue, watch, reset } = useForm();

  const formData = watch();

  useEffect(() => {
    if (id) {
      const service = servicesData.find((service) => service.id === id);
      if (service) {
        reset({ ...service });
      }
    }
  }, [id, reset]);

  const handleBackClick = () => {
    navigate(-1); // Go to the previous page
  };

  const onSubmit = (data) => {
    Swal.fire({
      text:
        mode === "edit"
          ? "Service updated successfully"
          : "Service created successfully",
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
        navigate("/services");
      },
    });
  };

  return (
    <div className="bg-gray-100 h-full">
      {/* Header */}
      <Header name={"Services"} />

      {/* Page Navigation */}
      <PageNavigation
        title={
          mode === "edit"
            ? "Edit Service"
            : mode === "view"
            ? "View Service"
            : "Create Service"
        }
        onBackClick={handleBackClick}
      />

      {/* Form Card */}
      <div className="bg-white shadow-lg rounded-lg p-4 mt-0 m-[12px] border">
        <h3 className="form-title p-2 pb-3 font-bold">
          {mode === "edit" ? "Edit Service" : "Create Service"}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Service Name */}
            <InputField
              label={"Service Name"}
              type={"text"}
              placeholder={"Enter Service Name"}
              {...register("name")}
              value={formData.name || ""}
              className="w-full focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D] p-2"
              disabled={mode === "view"}
            />

            {/* Service Description */}
            <InputField
              label={"Service Description"}
              type={"text"}
              placeholder={"Enter Service Description"}
              {...register("description")}
              value={formData.description || ""}
              className="w-full focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D] p-2"
              disabled={mode === "view"}
            />

            {/* From Date */}
            <InputField
              label={"From Date"}
              type={"date"}
              {...register("fromdate")}
              value={formData.fromdate || ""}
              className="w-full focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D] p-2"
              disabled={mode === "view"}
            />

            {/* To Date */}
            <InputField
              label={"To Date"}
              type={"date"}
              {...register("todate")}
              value={formData.todate || ""}
              className="w-full focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D] p-2"
              disabled={mode === "view"}
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
  );
};

export default CreateService;
