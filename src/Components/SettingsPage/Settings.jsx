import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Header from "../../common/Header";
import TextEditor from "./TextEditor";
import PasswordInput from "../../common/PasswordInput";
import TickSquare from "../../assets/images/TickSquare.svg";
import { data } from "react-router-dom";

const Settings = () => {
  const {
    register,
    handleSubmit,
    setValue,
    reset, // Used for setting default form values
    formState: { errors },
  } = useForm();

  const [termsContent, setTermsContent] = useState("");
  const [privacyContent, setPrivacyContent] = useState("");
  const [websiteImage, setWebsiteImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch settings when component mounts
  useEffect(() => {
    const fetchSettings = async () => {
      const token = Cookies.get("token");
      try {
        const response = await axios.get("http://localhost:5000/admin/getsettings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;
        console.log("Fetched Data:", data);

        // Use reset to populate all fields at once
        reset({
          notificationApiKey: data.notificationApiKey || "",
          smsApiKey: data.smsApiKey || "",
          paymentApiKey: data.paymentApiKey || "",
          emailApiKey: data.emailApiKey || "",
          whatsappApiKey: data.whatsappApiKey || "",
        });

        // Set state for editors separately
        setTermsContent(data.termsContent || "");
        setPrivacyContent(data.privacyContent || "");
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, [reset]); // Depend on reset to ensure fields update correctly


  // Handle form submission
  const onSubmit = async (formData) => {
    setLoading(true);
    console.log("Final Terms Content:", termsContent);
    console.log("Final Privacy Content:", privacyContent);

    const token = Cookies.get("token");

    try {
      const data = new FormData();
      if (websiteImage) data.append("websiteImage", websiteImage);
      data.append("notificationApiKey", formData.notificationApiKey || "");
      data.append("smsApiKey", formData.smsApiKey || "");
      data.append("paymentApiKey", formData.paymentApiKey || "");
      data.append("emailApiKey", formData.emailApiKey || "");
      data.append("whatsappApiKey", formData.whatsappApiKey || "");
      data.append("privacyContent", privacyContent || "");
      data.append("termsContent", termsContent || "");
      
      await axios.put("http://localhost:5000/admin/updatesettings", data, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data"  // This is important for FormData
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
    console.log(formData)
  };

  return (
    <div className="flex flex-col bg-gray-100 h-full">
      <Header name="Settings" />
      <div className="flex-1 bg-white rounded-lg shadow-md mx-4 mb-4 mt-4">
        <div className="h-[81vh] overflow-y-scroll scrollbar-color">
          <form className="space-y-6 px-6 py-4" onSubmit={handleSubmit(onSubmit)}>
            <h3 className="font-bold text-lg">Settings Details</h3>

            {/* Grid for Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-normal mb-[4px]">Website Image</label>
                <input
                  type="file"
                  onChange={(e) => setWebsiteImage(e.target.files[0])}
                  className="w-full py-[6px] px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D]"
                />
              </div>

              {/* Password Inputs with Controlled Values */}
              <PasswordInput
                label="Notification API key"
                placeholder="Enter API key"
                {...register("notificationApiKey", { required: "API key is required" })}
                onChange={(e) => setValue("notificationApiKey", e.target.value)}
                error={errors.notificationApiKey}
              />
              <PasswordInput
                label="SMS Gateway API key"
                placeholder="Enter API key"
                {...register("smsApiKey", { required: "API key is required" })}
                onChange={(e) => setValue("smsApiKey", e.target.value)}
                error={errors.smsApiKey}
              />
              <PasswordInput
                label="Payment Gateway API key"
                placeholder="Enter API key"
                {...register("paymentApiKey", { required: "API key is required" })}
                onChange={(e) => setValue("paymentApiKey", e.target.value)}
                error={errors.paymentApiKey}
              />
              <PasswordInput
                label="Email API key"
                placeholder="Enter API key"
                {...register("emailApiKey", { required: "API key is required" })}
                onChange={(e) => setValue("emailApiKey", e.target.value)}
                error={errors.emailApiKey}
              />
              <PasswordInput
                label="WhatsApp API key"
                placeholder="Enter API key"
                {...register("whatsappApiKey", { required: "API key is required" })}
                onChange={(e) => setValue("whatsappApiKey", e.target.value)}
                error={errors.whatsappApiKey}
              />
            </div>

            {/* Jodit Editor for Terms and Privacy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-gray-700 text-[12px] font-normal mb-2">
                  Privacy Policy
                </label>
                <TextEditor value={privacyContent} onChange={setPrivacyContent} />
              </div>

              <div>
                <label className="block text-gray-700 text-[12px] font-normal mb-2">
                  Terms And Conditions
                </label>
                <TextEditor value={termsContent} onChange={setTermsContent} />
              </div>
            </div>

            {/* Update Button */}
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
  );
};

export default Settings;
