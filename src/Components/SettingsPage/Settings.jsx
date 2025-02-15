import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Header from "../../common/Header";
import TextEditor from "./TextEditor";
import PasswordInput from "../../common/PasswordInput";
import TickSquare from "../../assets/images/TickSquare.svg";
import api from "../../utils/api";
import { useLoading } from "../../context/LoadingContext";
import Loader from "../../common/Loader";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const Settings = () => {
  const validationSchema = yup.object().shape({
    notificationApiKey: yup.string().required("notification API key is required"),
    smsGatewayApiKey: yup.string().required("smsGateway API key is required"),
    paymentGatewayApiKey: yup.string().required("paymentGateway API key is required"),
    emailApiKey: yup.string().required(" email API key is required"),
    whatsappApiKey: yup.string().required("whatsapp API key is required"),
    privacyPolicy: yup.string().required("Privacy Policy is required"),
    termsAndConditions: yup.string().required("Terms & Conditions are required"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({resolver:yupResolver(validationSchema),
    defaultValues: {
      privacyPolicy: "",
      termsAndConditions: "",
    },
  });

  const [websiteImage, setWebsiteImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isLoading,setIsLoading } = useLoading()

  useEffect(()=>{
    setIsLoading(true)
    const timer=setTimeout(() => {
      setIsLoading(false)
    }, 1000);
    return () => clearTimeout(timer);
  },[])

  useEffect(() => {
    const fetchSettings = async () => {
      const token = Cookies.get("token");
      try {
        const response = await api.get("/admin/getbyid", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.data.settings) {
          const data = response.data.settings; // Extract settings object
          console.log("Fetched Settings:", data); // Debugging
  
          reset({
            notificationApiKey: data?.notificationApiKey || "",
            smsGatewayApiKey: data?.smsGatewayApiKey || "",
            paymentGatewayApiKey: data?.paymentGatewayApiKey || "",
            emailApiKey: data?.emailApiKey || "",
            whatsappApiKey: data?.whatsappApiKey || "",
          });
  
          setValue("privacyPolicy", data?.privacyPolicy || "");
          setValue("termsAndConditions", data?.termsAndConditions || "");
        } else {
          console.error("Settings data not found in response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
  
    fetchSettings();
  }, [reset, setValue]);
  

  const onSubmit = async (formData) => {
    setLoading(true);
    const token = Cookies.get("token");
    try {
      const data = new FormData();
      if (websiteImage) data.append("websiteImage", websiteImage);
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key] || "");
      });

      await api.put("admin/updatesettings", data, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data"

        },
      });

      Swal.fire({
        text: "Settings updated successfully",
        imageUrl: TickSquare,
        imageWidth: 50,
        imageHeight: 50,
        background: "white",
        color: "black",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      Swal.fire({
        text: "Failed to update settings.",
        icon: "error",
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
    }
    console.log(formData);
  };

  return (
    <div>
      {isLoading && <Loader />}
      <div className="flex flex-col bg-gray-100 h-full">
      <Header name="Settings" />
      <div className="flex-1 bg-white rounded-lg shadow-md mx-4 mb-4 mt-4">
        <div className="h-[81vh] overflow-y-scroll scrollbar-color">
          <form
            className="space-y-6 px-6 py-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h3 className="font-bold text-lg">Settings Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-normal mb-[4px]">
                  Website Image
                </label>
                <input
                  type="file"
                  onChange={(e) => setWebsiteImage(e.target.files[0])}
                  className="w-full py-[6px] px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D]"
                />
                {errors.organizationType && <p className="text-red-500 text-xs mt-1">{errors.organizationType.message}</p>}

              </div>
              <div className="flex flex-col">
                <PasswordInput
                  label="Notification API Key"
                  placeholder="Enter API Key"
                  {...register("notificationApiKey", {
                    required: "API key is required",
                  })}
                  defaultValue={watch("notificationApiKey")}
                  error={errors.notificationApiKey}
                />
                {errors.notificationApiKey && <p className="text-red-500 text-xs mt-1">{errors.notificationApiKey.message}</p>}

              </div>

              <div className="flex flex-col">
                <PasswordInput
                  label="SMS Gateway API Key"
                  placeholder="Enter API Key"
                  {...register("smsGatewayApiKey", { required: "API key is required" })}
                  defaultValue={watch("smsGatewayApiKey")}
                  error={errors.smsGatewayApiKey}
                />
                {errors.smsGatewayApiKey && <p className="text-red-500 text-xs mt-1">{errors.smsGatewayApiKey.message}</p>}

              </div>

              <div className="flex flex-col">
                <PasswordInput
                  label="Payment Gateway API Key"
                  placeholder="Enter API Key"
                  {...register("paymentGatewayApiKey", {
                    required: "API key is required",
                  })}
                  defaultValue={watch("paymentGatewayApiKey")}
                  error={errors.paymentGatewayApiKey}
                />
                {errors.paymentGatewayApiKey && <p className="text-red-500 text-xs mt-1">{errors.paymentGatewayApiKey.message}</p>}

              </div>
              <div className="flex flex-col">
                <PasswordInput
                  label="Email API Key"
                  placeholder="Enter API Key"
                  {...register("emailApiKey", {
                    required: "API key is required",
                  })}
                  defaultValue={watch("emailApiKey")}
                  error={errors.emailApiKey}
                />
                {errors.emailApiKey && <p className="text-red-500 text-xs mt-1">{errors.emailApiKey.message}</p>}

              </div>

              <div className="flex flex-col">
                <PasswordInput
                  label="WhatsApp API Key"
                  placeholder="Enter API Key"
                  {...register("whatsappApiKey", {
                    required: "API key is required",
                  })}
                  defaultValue={watch("whatsappApiKey")}
                  error={errors.whatsappApiKey}
                />
                {errors.whatsappApiKey && <p className="text-red-500 text-xs mt-1">{errors.whatsappApiKey.message}</p>}

              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-gray-700 text-[12px] font-normal mb-2">
                  Privacy Policy
                </label>
                <TextEditor
                  value={watch("privacyPolicy")}
                  onChange={(value) => setValue("privacyPolicy", value)}
                />
                {errors.privacyPolicy && (
            <p className="text-red-500 text-xs">{errors.privacyPolicy.message}</p>
          )}
              </div>

              <div>
                <label className="block text-gray-700 text-[12px] font-normal mb-2">
                  Terms And Conditions
                </label>
                <TextEditor
                  value={watch("termsAndConditions")}
                  onChange={(value) => setValue("termsAndConditions", value)}
                />
                {errors.termsAndConditions && (
            <p className="text-red-500 text-xs">{errors.termsAndConditions.message}</p>
          )}
              </div>
            </div>

            <div className="text-right">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 text-white text-[12px] bg-[#660F5D] rounded-lg hover:bg-[#5c0e58]"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Settings;
