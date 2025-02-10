import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import Header from "../../common/Header";
import PageNavigation from "../../common/PageNavigation";
import { InputField } from "../../common/Input_fileds";
import TickSquare from "../../assets/images/TickSquare.svg";
import axios from "axios";
import api from "../../utils/api";

const CreateService = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, mode: initialMode } = location.state || {};
  console.log("Received ID:", id); // Debugging ID value
  const [mode, setMode] = useState(initialMode || "create");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();
  const [formData,setFormData]=useState({id:null || id,servicename:"",servicedescription:"",fromdate:"",todate:""})

  useEffect(() => {
    if (id && (mode === "edit" || mode === "view")) {
      api
        .get(`admin/getbyid/${id}`)
        .then((response) => {
          const servicedata = response.data.data; // Correctly access `data`
          console.log("Fetched Data:", servicedata); // Debugging API response
  
          Object.keys(servicedata).forEach((key)=>{
            if(servicedata[key] !== null && typeof servicedata[key] === "object"){
              Object.keys(servicedata[key]).forEach((nestedkey)=>{
                setValue(`${key}.${nestedkey}`,servicedata[key][nestedkey])
              })
            }else{
              setValue(key,servicedata[key])
            }
          })
        })
        .catch((error) => console.error("Error fetching service data:", error));
    } else {
      setMode("create");
    }
  }, [id, mode, setValue, location.state]);
   // Added `location.state` dependency

  const handleBackClick = () => {
    navigate(-1);
  };

  const onSubmit = async (data) => {
    console.log("Form Data:", data); // Debugging form submission
    const serviceData = {
      servicename: data.servicename,
      servicedescription: data.servicedescription,
      fromdate: data.fromdate,
      todate: data.todate,
    };

    // If there's an ID (for edit), include it in the payload
    if (id) {
      serviceData.id = data.id;
    }

    try {
      // Send data as JSON, not FormData
      const response = await api.post(`admin/createservice`, serviceData, {
        
      });
      console.log(response.data);
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
      reset(); // Reset form values after submission
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
      <Header name={"Services"} />

      <PageNavigation
        title={mode === "edit" ? "Edit Service" : mode === "view" ? "View Service" : "Create Service"}
        onBackClick={handleBackClick}
      />

      <div className="bg-white shadow-lg rounded-lg p-4 mt-0 m-[12px] border">
        <h3 className="form-title p-2 pb-3 font-bold">
          {mode === "edit" ? "Edit Service" : mode === "view" ? "View Service" : "Create Service"}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <InputField
              label="Service Name"
              type="text"
              placeholder="Enter Service Name"
              {...register("servicename", { required: "Service Name is required" })}
              error={errors.servicename}
              readOnly={mode === "view"}
            />

            <InputField
              label="Service Description"
              type="text"
              placeholder="Enter Service Description"
              {...register("servicedescription", { required: "Description is required" })}
              error={errors.servicedescription}
              readOnly={mode === "view"}
            />

            <InputField
              label="From Date"
              type="date"
              {...register("fromdate", { required: "From Date is required" })}
              error={errors.fromdate}
              readOnly={mode === "view"}
            />

            <InputField
              label="To Date"
              type="date"
              {...register("todate", { required: "To Date is required" })}
              error={errors.todate}
              readOnly={mode === "view"}
            />
          </div>

          {mode !== "view" && (
            <div className="flex justify-end gap-3 mt-4">
              <button type="reset" className="bg-white text-gray-500 px-4 py-1 rounded-md border border-gray-300 text-sm">
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
