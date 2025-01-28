import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Header from "../../common/Header";
import PageNavigation from "../../common/PageNavigation";
import { InputField } from "../../common/Input_fileds";
import Swal from "sweetalert2"; // Import SweetAlert
import TickSquare from "../../assets/images/TickSquare.svg"; // Success icon
import { organizationTypesData } from "../../Data/data";
import { ReactComponent as Cancelbtnicon } from "../../assets/images/Cancel_button_icon.svg";

const CreateOrganizationType = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, mode: initialMode } = location.state || {};
  const [mode, setMode] = useState(initialMode || "create");
  const [formData, setFormData] = useState({
    type: "",
    fromdate: "",
    todate: "",
    servicesProvided: "",
    location: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // Make sure you use this to set the form data on edit
  } = useForm();

  // Fetch and set data for edit or view mode
  useEffect(() => {
    if (id) {
      const orgType = organizationTypesData.find((org) => org.id === id);
      if (orgType) {
        setFormData(orgType);
        // Set form values using setValue
        setValue("organizationType", orgType.type);
        setValue("description", orgType.description);
        setValue("fromDate", orgType.fromdate);
        setValue("toDate", orgType.todate);
      }
    }
  }, [id, setValue]);

  // Set mode dynamically
  useEffect(() => {
    if (location.state) {
      const { mode } = location.state;
      setMode(mode || "create");
    }
  }, [location.state]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const onSubmit = (data) => {
    if (mode === "edit") {
      console.log("Editing organization type:", data);
    } else {
      console.log("Creating new organization type:", data);
    }

    // SweetAlert success message
    Swal.fire({
      text:
        mode === "edit"
          ? "Organization Type Updated Successfully"
          : "Organization Type Created Successfully",
      imageUrl: TickSquare,
      imageWidth: 50,
      imageHeight: 50,
      background: "white",
      color: "black",
      showConfirmButton: false,
      timer: 1500,
      willClose: () => {
        navigate("/organizationtypelist");
      },
    });
  };

  return (
    <div className="create-organization-type-container flex flex-col min-h-screen bg-gray-100">
      <Header name="Organization Types" />
      <PageNavigation
        title={
          mode === "edit"
            ? "Edit Organization Type"
            : mode === "view"
            ? "View Organization Type"
            : "Create Organization Type"
        }
        onBackClick={handleBackClick}
      />

      <div className="create-organization-form-container flex-1 bg-white px-6 py-4 rounded-lg shadow-md mx-4 mb-4">
        <form
          className="organization-form-container space-y-4"
          onSubmit={handleSubmit(onSubmit)} // Make sure this is triggered on form submission
        >
          <h3 className="form-title p-2 font-bold">
            {mode === "edit"
              ? "Edit Organization Type"
              : mode === "view"
              ? "View Organization Type"
              : "Create Organization Type"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <InputField
              label="Organization Type"
              type="text"
              placeholder="Enter Organization Type Name"
              value={formData.type || ""}
              {...register("organizationType", {
                required: "Organization Type is required",
              })}
              error={errors.organizationType}
              className="focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D] p-2"
              readOnly={mode === "view"}
            />
            <InputField
              label="Description"
              type="text"
              placeholder="Enter Description"
              value={formData.description || ""}
              {...register("description", {
                required: "Description is required",
              })}
              error={errors.description}
              className="focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D] p-2"
              readOnly={mode === "view"}
            />
            <InputField
              label="From Date"
              type="date"
              value={formData.fromdate || ""}
              {...register("fromDate", { required: "From Date is required" })}
              error={errors.fromDate}
              className="focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D] p-2"
              readOnly={mode === "view"}
            />
            <InputField
              label="To Date"
              type="date"
              value={formData.todate || ""}
              {...register("toDate", { required: "To Date is required" })}
              error={errors.toDate}
              className="focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D] p-2"
              readOnly={mode === "view"}
            />
          </div>

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
                name="submit"
                type="submit" // Ensure this is type submit
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

export default CreateOrganizationType;
