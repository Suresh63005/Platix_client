import React, { useState } from "react";
import Header from "../../common/Header";
import { InputField } from "../../common/Input_fileds";
import { PhoneNumberInput } from "../../common/Input_fileds";
import PasswordInput from "../../common/PasswordInput";
import { Icon } from "@iconify/react";
import ProfileICon from "../../assets/images/User-100.svg";

const Account = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [password, setPassword] = useState({
    password: "",
    confirmPassword: "",
  });
  const [phoneNumber, setPhoneNumber] = useState("");

  // Handle Profile Image Change
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle Input Change (For Password and Confirm Password)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPassword((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="bg-gray-100 h-full">
      <Header name={"Account"} />
      <div className="max-w-5xl mx-auto p-4  ">
        {/* Profile Picture Upload Section */}
        <div className="text-center mb-6">
          <div className="relative bg-white rounded-lg w-full flex justify-center p-6">
            <div className="relative">
              <img
                src={profileImage || ProfileICon}
                alt="Profile"
                className="w-[60px] h-[60px] rounded-full object-cover object-center"
              />
              <label
                htmlFor="profile-upload"
                className="absolute bottom-0 right-0 text-[#660F5D] border border-[#660F5D] bg-white rounded-full p-1 cursor-pointer"
              >
                <Icon icon="mdi:plus" width={10} />
              </label>
            </div>
            <input
              id="profile-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleProfileImageChange}
            />
          </div>
        </div>

        {/* Account Details Section */}
        <div className="bg-white shadow-lg rounded-lg px-6 py-6">
          <h3 className="form-title text-lg font-bold mb-4">Account Details</h3>
          <form action="">
            <div className="flex flex-wrap gap-4">
              {/* Name and Date of Birth */}
              <div className="flex w-full flex-wrap gap-4">
                <div className="w-full md:flex-1">
                  <InputField label={"Name"} type={"text"} placeholder={"Enter Your Name"} />
                </div>
                <div className="w-full md:flex-1">
                  <InputField label={"Date of Birth"} type={"date"} />
                </div>
              </div>

              {/* Phone Number and Email */}
              <div className="flex w-full flex-wrap gap-4">
                <div className="w-full md:flex-1">
                  <PhoneNumberInput
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    defaultCountry="US"
                    label={"Phone Number"}
                    className="p-2"
                  />
                </div>
                <div className="w-full md:flex-1">
                  <InputField
                    label={"Email"}
                    type={"email"}
                    placeholder={"Enter your email"}
                  />
                </div>
              </div>

              {/* Password and Confirm Password */}
              <div className="flex w-full flex-wrap gap-4">
                <div className="w-full md:flex-1">
                  <PasswordInput
                    label={"Password"}
                    name="password"
                    value={password.password}
                    onChange={handleInputChange}
                    placeholder={"Password"}
                  />
                </div>
                <div className="w-full md:flex-1">
                  <PasswordInput
                    label={"Confirm Password"}
                    name="confirmPassword"
                    value={password.confirmPassword}
                    onChange={handleInputChange}
                    className={""}
                    placeholder={"Confirm Password"}
                  />
                </div>
              </div>
            </div>

            <div className="text-right mt-6">
              <button
                type="submit"
                className="bg-[#660F5D] text-white text-[12px] py-2 px-8 rounded-md w-full md:w-auto"
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

export default Account;
