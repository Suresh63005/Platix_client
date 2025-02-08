import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Header from "../../common/Header";
import { InputField, PhoneNumberInput } from "../../common/Input_fileds";
import PasswordInput from "../../common/PasswordInput";
import { Icon } from "@iconify/react";
import ProfileICon from "../../assets/images/User-100.svg";
import api from "../../utils/api";

const API_BASE_URL = "http://localhost:5000/admin/profile/"; // Adjust as needed

const Account = () => {
  const token = Cookies.get("token"); // Get token from cookies

  // Extract admin ID from JWT
  let adminId = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      adminId = decodedToken.id; // Adjust based on your JWT structure
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  const [profile, setProfile] = useState({
    name: "",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
    imgPreview:null,
  });

  const [loading, setLoading] = useState(false);

  // Fetch Profile on Load
  useEffect(() => {
    if (!adminId) return; // Stop if no valid admin ID

    const fetchProfile = async () => {
      try {
        const response = await api.get(
          `admin/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = response.data;
        console.log("Fetched Data:", data);

        setProfile({
          name: data.name || "",
          dateOfBirth: data.dateOfBirth || "",
          phoneNumber: data.phoneNumber || "",
          email: data.email || "",
          password:"",
          confirmPassword: "",
          profileImage: data.profileImage || ProfileICon,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [adminId, token]);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);
      setProfile((prevData) => ({
        ...prevData,
        profileImage: file, 
        imgPreview: previewUrl, 
      }));
    } else {
      setProfile((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  console.log(profile,"from profile");

  

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (profile.password && profile.password !== profile.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const formData = new FormData();

    formData.append("name",profile.name);
    formData.append("dateOfBirth",profile.dateOfBirth);
    formData.append("phoneNumber",profile.phoneNumber);
    formData.append("confirmPassword",profile.confirmPassword);
    formData.append("email",profile.email);
    formData.append("password",profile.password);

    if(profile.profileImage) formData.append("profileImage",profile.profileImage);
    

    setLoading(true);
    try {
      
      await api.put(
        `admin/profile/update`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 h-full">
      <Header name={"Account"} />
      <div className="max-w-5xl mx-auto p-4">
        {/* Profile Picture Upload Section */}
        <div className="text-center mb-6">
          <div className="relative bg-white rounded-lg w-full flex justify-center p-6">
            <div className="relative">
              <img
                src={profile.profileImage || profile.imgPreview}
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
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Account Details Section */}
        <div className="bg-white shadow-lg rounded-lg px-6 py-6">
          <h3 className="form-title text-lg font-bold mb-4">Account Details</h3>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap gap-4">
              {/* Name and Date of Birth */}
              <div className="flex w-full flex-wrap gap-4">
                <div className="w-full md:flex-1">
                  <InputField
                    label={"Name"}
                    name="name"
                    type="text"
                    value={profile.name}
                    onChange={handleChange}
                    placeholder={"Enter Your Name"}
                  />
                </div>
                <div className="w-full md:flex-1">
                  <InputField
                    label={"Date of Birth"}
                    name="dateOfBirth"
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Phone Number and Email */}
              <div className="flex w-full flex-wrap gap-4">
                <div className="w-full md:flex-1">
                  <PhoneNumberInput
                    value={profile.phoneNumber}
                    onChange={(value) =>
                      setProfile({ ...profile, phoneNumber: value })
                    }
                    defaultCountry="US"
                    label={"Phone Number"}
                    className="p-2"
                  />
                </div>
                <div className="w-full md:flex-1">
                  <InputField
                    label={"Email"}
                    name="email"
                    type="email"
                    value={profile.email}
                    readOnly // Email should be read-only
                  />
                </div>
              </div>

              {/* Password and Confirm Password */}
              <div className="flex w-full flex-wrap gap-4">
                <div className="w-full md:flex-1">
                  <PasswordInput
                    label={"Password"}
                    name="password"
                    value={profile.password}
                    onChange={handleChange}
                    placeholder={"Password"}
                  />
                </div>
                <div className="w-full md:flex-1">
                  <PasswordInput
                    label={"Confirm Password"}
                    name="confirmPassword"
                    value={profile.confirmPassword}
                    onChange={handleChange}
                    placeholder={"Confirm Password"}
                  />
                </div>
              </div>
            </div>

            <div className="text-right mt-6">
              <button
                type="submit"
                className="bg-[#660F5D] text-white text-[12px] py-2 px-8 rounded-md w-full md:w-auto"
                disabled={loading}
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

export default Account;
