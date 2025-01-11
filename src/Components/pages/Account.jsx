import React, { useState } from 'react';
import Header from '../../common/Header';
import { InputField } from '../../common/Input_fileds';
import { PhoneNumberInput } from '../../common/Input_fileds';
import PasswordInput from '../../common/PasswordInput';
import { Icon } from '@iconify/react';
import ProfileICon from '../../assets/images/User-100.svg'

const Account = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [password, setPassword] = useState({
    password: '',
    confirmPassword: ''
  });
  const [phoneNumber, setPhoneNumber] = useState('');

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
    <div className="bg-gray-100">
      <Header name={"Account"} />
      <div className="max-w-5xl mx-auto p-4 h-[81vh] overflow-y-scroll">
        {/* Profile Picture Upload Section */}
        <div className="text-center mb-6">
  <div className="relative bg-white w-full flex justify-center p-6">
    <div className="relative">
      <img
        src={profileImage || ProfileICon}
        alt="Profile"
        className="w-[150px] h-[150px] rounded-full object-cover object-center"
      />
      <label
        htmlFor="profile-upload"
        className="absolute bottom-0 right-0 bg-[#660F5D] text-white rounded-full p-2 cursor-pointer"
      >
        <Icon icon="mdi:plus" width={18} />
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
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h3 className="form-title text-lg font-bold mb-4">Account Details</h3>
          <form action="">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <InputField label={"Name"} type={"text"} />
                <PhoneNumberInput
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  defaultCountry="US"
                  label={"Phone Number"}
                  className="p-2"
                />
              </div>
              <div>
                <InputField label={"Date of Birth"} type={"date"} />
                <InputField label={"Email"} type={"email"} placeholder={"Enter your email"} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <PasswordInput label={"Password"} name="password" value={password.password} onChange={handleInputChange} />
              </div>
              <div>
                <PasswordInput label={"Confirm Password"} name="confirmPassword" value={password.confirmPassword} onChange={handleInputChange} />
              </div>
            </div>
            <div className="text-right mt-6">
              <button
                type="submit"
                className="bg-[#660F5D] text-white py-2 px-4 rounded-md"
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
