import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import Header from "../../common/Header";
import PageNavigation from "../../common/PageNavigation";
import { InputField } from "../../common/Input_fileds";
import TickSquare from "../../assets/images/TickSquare.svg";
import api from "../../utils/api";
import { useLoading } from "../../context/LoadingContext";
import Loader from "../../common/Loader";
import Cookies from "js-cookie";

const CreateService = () => {
  const serviceNameRegex = /^[a-zA-Z\s]{2,100}$/; // Regex for service name validation
  const navigate = useNavigate();
  const location = useLocation();
  const { id, mode } = location.state || {};
  const { isLoading, setIsLoading } = useLoading();
  const [mode1, setMode1] = useState(mode || "create");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    trigger,
  } = useForm();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [setIsLoading]);

  useEffect(() => {
    const token = Cookies.get("token");
    if (id && (mode1 === "edit" || mode1 === "view")) {
      api
        .get(`admin/getbyid/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const servicedata = response.data.data;
          console.log("Fetched Data:", servicedata);

          Object.keys(servicedata).forEach((key) => {
            if (servicedata[key] !== null && typeof servicedata[key] === "object") {
              Object.keys(servicedata[key]).forEach((nestedKey) => {
                setValue(`${key}.${nestedKey}`, servicedata[key][nestedKey]);
              });
            } else {
              setValue(key, servicedata[key]);
            }
          });
        })
        .catch((error) => console.error("Error fetching service data:", error))
        .finally(() => setIsLoading(false));
    } else {
      setMode1("create");
    }
  }, [id, mode1, setValue]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    const serviceData = {
      servicename: data.servicename,
      servicedescription: data.servicedescription,
      fromdate: data.fromdate,
      todate: data.todate || null,
    };

    if (id) {
      serviceData.id = id;
    }

    try {
      const token = Cookies.get("token");
      const response = await api.post(`admin/createservice`, serviceData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(response.data);

      Swal.fire({
        text: mode1 === "edit" ? "Service updated successfully" : "Service created successfully",
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

      reset();
    } catch (error) {
      console.error("Error creating/updating service:", error);
      Swal.fire({
        text: "An error occurred. Please try again.",
        icon: "error",
        showConfirmButton: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && <Loader />}
      <div className="bg-gray-100 h-full">
        <Header name={"Services"} />

        <PageNavigation
          title={mode1 === "edit" ? "Edit Service" : mode1 === "view" ? "View Service" : "Create Service"}
          onBackClick={handleBackClick}
        />

        <div className="bg-white shadow-lg rounded-lg p-4 mt-0 m-[12px] border">
          <h3 className="form-title p-2 pb-3 font-bold">
            {mode1 === "edit" ? "Edit Service" : mode1 === "view" ? "View Service" : "Create Service"}
          </h3>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              
              {/* Service Name */}
              <div className="flex flex-col">
                <InputField
                  label="Service Name*"
                  type="text"
                  placeholder="Enter Service Name"
                  {...register("servicename", {
                    required: "Service Name is required",
                    pattern: { value: serviceNameRegex, message: "Enter a valid Service Name" },
                  })}
                  onChange={(e) => {
                    setValue("servicename", e.target.value);
                    trigger("servicename");
                  }}
                  error={errors.servicename}
                  readOnly={mode1}
                />
                {errors.servicename && <p className="text-red-500 text-xs mt-1">{errors.servicename.message}</p>}
              </div>

              {/* Service Description */}
              <div className="flex flex-col">
                <InputField
                  label="Service Description*"
                  type="text"
                  placeholder="Enter Service Description"
                  {...register("servicedescription", {
                    required: "Description is required",
                    pattern: { value: serviceNameRegex, message: "Enter a valid Service Description" },
                  })}
                  onChange={(e) => {
                    setValue("servicedescription", e.target.value);
                    trigger("servicedescription");
                  }}
                  error={errors.servicedescription}
                  readOnly={mode1}
                />
                {errors.servicedescription && <p className="text-red-500 text-xs mt-1">{errors.servicedescription.message}</p>}
              </div>

              {/* From Date */}
              <div className="flex flex-col">
                <InputField
                  label="From Date*"
                  type="date"
                  {...register("fromdate", { required: "From Date is required" })}
                  error={errors.fromdate}
                  readOnly={mode1}
                  restrictDate={new Date().toISOString().split("T")[0]}
                />
                {errors.fromdate && <p className="text-red-500 text-xs mt-1">{errors.fromdate.message}</p>}
              </div>

              {/* To Date */}
              <div className="flex flex-col">
                <InputField
                  label="To Date"
                  type="date"
                  {...register("todate")}
                  restrictDate={new Date().toISOString().split("T")[0]}
                  readOnly={mode1}
                />
                {errors.todate && <p className="text-red-500 text-xs mt-1">{errors.todate.message}</p>}
              </div>
            </div>

            {mode1 !== "view" && (
              <div className="flex justify-end gap-3 mt-4">
                <button type="reset" onClick={() => navigate("/services")} className="bg-white text-gray-500 px-4 py-1 rounded-md border border-gray-300 text-sm">
                  Cancel
                </button>
                <button type="submit" className="bg-[#660F5D] text-white px-7 py-1 rounded-md text-sm">
                  {mode1 === "edit" ? "Update" : "Save"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateService;
