import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Header from "../../common/Header";
import { InputField, PhoneNumberInput } from "../../common/Input_fileds";
import PasswordInput from "../../common/PasswordInput";
import { Icon } from "@iconify/react";
import ProfileICon from "../../assets/images/User-100.svg";
import api from "../../utils/api";

const Account = () => {
  const token = Cookies.get("token");
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  // Extract admin ID from JWT
  let adminId = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      adminId = decodedToken.id;
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
    imgPreview: ProfileICon,
  });

  useEffect(() => {
    if (!adminId) return;

    const fetchProfile = async () => {
      try {
        const response = await api.get(`admin/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;
        console.log("Fetched Data:", data);

        setProfile({
          name: data.name || "",
          dateOfBirth: data.dateOfBirth || "",
          phoneNumber: data.phoneNumber || "",
          email: data.email || "",
          password: "",
          confirmPassword: "",
          profileImage: data.profileImage || ProfileICon,
          imgPreview: data.profileImage || ProfileICon,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [adminId, token]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedPhoneNumber = profile.phoneNumber.replace(/\s+/g, "");
    if (profile.password && profile.password !== profile.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("dateOfBirth", profile.dateOfBirth);
    formData.append("phoneNumber", formattedPhoneNumber);
    formData.append("confirmPassword", profile.confirmPassword);
    formData.append("email", profile.email);
    formData.append("password", profile.password);
    if (profile.profileImage) formData.append("profileImage", profile.profileImage);

    setLoading(true);
    try {
      const response = await api.put(`admin/profile/update`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        alert(response.data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update profile.";
      alert(errorMessage);  // Show the backend error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 h-[100vh]">
      <Header name={"Account"} />
      <div className="max-w-5xl mx-auto p-4">
        {/* Profile Picture Upload Section */}
        <div className="text-center mb-6">
          <div className="relative bg-white rounded-lg w-full flex justify-center p-6">
            <div className="relative">
              <img
                src={profile.imgPreview}
                alt="Profile"
                className="w-[60px] h-[60px] rounded-full object-cover object-center"
              />
              <label
                htmlFor="profile-upload"
                className="absolute bottom-0 right-0 text-[#660F5D] border border-[#660F5D] bg-white rounded-full p-1 cursor-pointer"
                title="Click to change profile picture"
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
                    onChange={(value) => {
                      const cleaned = value ? value.replace(/\s+/g, "") : "";

                      setProfile({ ...profile, phoneNumber: cleaned });

                      const indianRegex = /^\+91\d{10}$/;
                      if (cleaned && !indianRegex.test(cleaned)) {
                        setPhoneError("Phone number must be 10 digits after +91");
                      } else {
                        setPhoneError("");
                      }
                    }}


                    defaultCountry="IN"
                    label={"Phone Number"}
                    className="p-2"
                  />
                  {phoneError && (
                    <p className="text-red-500 text-xs mt-1">{phoneError}</p>
                  )}

                </div>
                <div className="w-full md:flex-1">
                  <InputField
                    label={"Email"}
                    name="email"
                    type="email"
                    value={profile.email}
                  // readOnly 
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
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, password: e.target.value }))
                    }
                    placeholder={"Password"}
                  />
                </div>
                <div className="w-full md:flex-1">
                  <PasswordInput
                    label={"Confirm Password"}
                    name="confirmPassword"
                    value={profile.confirmPassword}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
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
