import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Header from "../../common/Header";
import TextEditor from "./TextEditor";
import PasswordInput from "../../common/PasswordInput";
import Swal from "sweetalert2";
import TickSquare from "../../assets/images/TickSquare.svg";

const Settings = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [termsContent, setTermsContent] = useState("");
  const [privacyContent, setPrivacyContent] = useState("");

  const onSubmit = (data) => {
    console.log("Form Data:", data); // Debugging
    console.log("Terms Content:", termsContent); // Debugging
    console.log("Privacy Content:", privacyContent); // Debugging

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
                  className="w-full py-[6px] px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D]"
                />
              </div>

              {/* Password Inputs */}
              <PasswordInput
                label="Notification API key"
                placeholder="Enter API key"
                {...register("notificationApiKey", {
                  required: "API key is required",
                })}
                error={errors.notificationApiKey}
              />
              <PasswordInput
                label="SMS Gateway API key"
                placeholder="Enter API key"
                {...register("smsApiKey", { required: "API key is required" })}
                error={errors.smsApiKey}
              />
              <PasswordInput
                label="Payment Gateway API key"
                placeholder="Enter API key"
                {...register("paymentApiKey", { required: "API key is required" })}
                error={errors.paymentApiKey}
              />
              <PasswordInput
                label="Email API key"
                placeholder="Enter API key"
                {...register("emailApiKey", { required: "API key is required" })}
                error={errors.emailApiKey}
              />
              <PasswordInput
                label="WhatsApp API key"
                placeholder="Enter API key"
                {...register("whatsappApiKey", { required: "API key is required" })}
                error={errors.whatsappApiKey}
              />
            </div>

            {/* Jodit Editor for Terms and Privacy Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-gray-700 text-[12px] font-normal mb-2">
                  Privacy Policy
                </label>
                <TextEditor
                  value={privacyContent}
                  onChange={(newContent) => setPrivacyContent(newContent)}
                />
              </div>

              <div>
                <label className="block text-gray-700 text-[12px] font-normal mb-2">
                  Terms And Conditions
                </label>
                <TextEditor
                  value={termsContent}
                  onChange={(newContent) => setTermsContent(newContent)}
                />
              </div>
            </div>

            {/* Update Button */}
            <div className="text-right">
              <button
                type="submit"
                className="px-6 py-2 text-white text-[12px] bg-[#660F5D] rounded-lg hover:bg-[#5c0e58]"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;