import React, { useState } from "react";
import Header from "../../common/Header";
import JoditEditor from "jodit-react";
import PasswordInput from "../../common/PasswordInput";

const Settings = () => {
  const [termsContent, setTermsContent] = useState("");
  const [privacyContent, setPrivacyContent] = useState("");

  const config = {
    readonly: false,
    height: 300,
  };

  const handleUpdate = () => {
    console.log("Updated terms and privacy policy");
  };

  return (
    <div className="flex flex-col bg-gray-100">
      <Header name="Settings" />
      <div className="flex-1 bg-white rounded-lg shadow-md mx-4 mb-4 mt-4">
        <div className="h-[81vh] overflow-y-scroll">
          <form className="space-y-6 px-6 py-4">
            <h3 className="font-bold text-lg">Settings Details</h3>

            {/* Grid for Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Website Image
                </label>
                <input
                  type="text"
                  placeholder="Enter Name"
                  className="w-full py-2 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D]"
                />
              </div>

              <PasswordInput
                label="Notification API key"
                placeholder="Enter API key"
              />

              <PasswordInput
                label="SMS Gateway API key"
                placeholder="Enter API key"
                
              />

              <PasswordInput
                label="Payment Gateway API key"
                placeholder="Enter API key"
              />

              <PasswordInput
                label="Email API key"
                placeholder="Enter API key"
              />

              <PasswordInput
                label="WhatsApp API key"
                placeholder="Enter API key"
              />
            </div>

            {/* Jodit Editor for Terms and Privacy Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Privacy Policy
                </label>
                <JoditEditor
                  value={privacyContent}
                  config={config}
                  onChange={(newContent) => setPrivacyContent(newContent)}
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Terms And Conditions
                </label>
                <JoditEditor
                  value={termsContent}
                  config={config}
                  onChange={(newContent) => setTermsContent(newContent)}
                />
              </div>
            </div>

            {/* Update Button */}
            <div className="text-right">
              <button
                type="button"
                onClick={handleUpdate}
                className="px-6 py-2 text-white bg-[#660F5D] rounded-lg hover:bg-[#5c0e58]"
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
