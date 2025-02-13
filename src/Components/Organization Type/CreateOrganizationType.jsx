import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Header from "../../common/Header";
import PageNavigation from "../../common/PageNavigation";
import { InputField } from "../../common/Input_fileds";
import Swal from "sweetalert2"; // Import SweetAlert
import TickSquare from "../../assets/images/TickSquare.svg"; // Success icon
import { ReactComponent as Cancelbtnicon } from "../../assets/images/Cancel_button_icon.svg";
import axios from "axios";
import { Vortex } from 'react-loader-spinner';
import api from "../../utils/api";
import { useLoading } from "../../context/LoadingContext";
import Loader from "../../common/Loader";

const CreateOrganizationType = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, mode: initialMode } = location.state || {};
  const mode = initialMode || "create";
  const [loading, setloading] = useState(false)
  const { isLoading,setIsLoading }= useLoading()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  useEffect(()=>{
    setIsLoading(true)
    const timer=setTimeout(() => {
      setIsLoading(false)
    }, 1000);
    return ()=>clearTimeout(timer)
  },[])
  // Fetch organization type details if in edit or view mode
  useEffect(() => {
    if (id && (mode === "edit" || mode === "view")) {

      api.get(`organization/getbyid/${id}`)
        .then((response) => {
          const orgData = response.data.data;
          // Pre-fill form fields
          setValue("organizationType", orgData.organizationType || "");
          setValue("description", orgData.description || "");
          setValue("fromDate", orgData.fromDate?.split("T")[0] || "");
          setValue("toDate", orgData.toDate?.split("T")[0] || "");
        })
        .catch((error) => {
          console.error("Error fetching organization type:", error);
        });
    }
  }, [id, mode, setValue]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const onSubmit = async (data) => {
    setloading(true)
    try {
      const url = "organization/organization-type";

      const response = await api({
        method: "post", // Always "post"
        url: url,
        data: id ? { id, ...data } : data, 
      });
      

      setTimeout(() => {
        if (response.status === 200 || response.status === 201) {
          Swal.fire({
            text: id
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
        }
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        text: "Something went wrong! Please try again.",
        icon: "error",
        background: "white",
        color: "black",
      });
    }finally{
      setloading(false)
    }
  };

  return (
    <div>
      {isLoading && <Loader />}
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

      <div className="create-organization-form-container border border-[#EAEAFF] flex-1 bg-white px-6 py-4 rounded-lg shadow-md mx-4 mb-4 max-h-[max-content]">
        <form className="organization-form-container space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <h3 className="form-title p-2 font-bold">
            {mode === "edit"
              ? "Edit Organization Type"
              : mode === "view"
              ? "View Organization Type"
              : "Create Organization Type"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <InputField
                label="Organization Type"
                type="text"
                placeholder="Enter Organization Type Name"
                {...register("organizationType", { required: "Organization Type is required" })}
                error={errors.organizationType}
                readOnly={mode === "view"}
              />
              {errors.organizationType && <p className="text-red-500 text-xs mt-1">{errors.organizationType.message}</p>}

            </div>

            <div className="flex flex-col">
              <InputField
                label="Description"
                type="text"
                placeholder="Enter Description"
                {...register("description", { required: "Description is required" })}
                error={errors.description}
                readOnly={mode === "view"}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}

            </div>

            <div className="flex flex-col">
              <InputField
                label="From Date"
                type="date"
                {...register("fromDate", { required: "From Date is required" })}
                error={errors.fromDate}
                readOnly={mode === "view"}
              />
              {errors.fromDate && <p className="text-red-500 text-xs mt-1">{errors.fromDate.message}</p>}
            </div>

            <div className="flex flex-col">
              <InputField
                label="To Date"
                type="date"
                {...register("toDate", { required: "To Date is required" })}
                error={errors.toDate}
                readOnly={mode === "view"}
              />
              {errors.toDate && <p className="text-red-500 text-xs mt-1">{errors.toDate.message}</p>}
            </div>

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
              <button type="submit" className="bg-[#660F5D] text-white px-7 py-1 rounded-md text-sm">
              {loading ? (
                  <Vortex
                    visible={true}
                    height="25"
                    width="50"
                    ariaLabel="vortex-loading"
                    wrapperStyle={{}}
                    wrapperClass="vortex-wrapper"
                    colors={['white', 'white', 'white', 'white', 'white', 'white']}
                  />
                ) : (
                  mode === "edit" ? "Update" : "Save"
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
    </div>
  );
};

export default CreateOrganizationType;
