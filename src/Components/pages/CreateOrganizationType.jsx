import React, { useState } from 'react';
import Header from '../../common/Header';
import PageNavigation from '../../common/PageNavigation';
import { InputField } from '../../common/Input_fileds';
import Submit from '../../common/Submit';

const CreateOrganizationType = () => {
  const [organizationType, setOrganizationType] = useState('');
  const [description, setDescription] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add form submission logic
  };

  return (
    <div className="create-organization-type-container flex flex-col min-h-screen bg-gray-100">
      <Header name={"Organization Types"} />
      <PageNavigation title={"Create Organization Type"} />

      <div className="create-organization-form-container flex-1 bg-white px-6 py-4 rounded-lg shadow-md mx-4 mb-4">
        <form className="organization-form-container space-y-4" onSubmit={handleSubmit}>
          <h3 className="form-title p-2 font-bold">Create Organization Type</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <InputField
              label="Organization Type"
              type="text"
              placeholder="Enter Organization Type"
              value={organizationType}
              onChange={(e) => setOrganizationType(e.target.value)}
              className="focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D] p-2"
            />
            <InputField
              label="Description"
              type="text"
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D] p-2"
            />
            <InputField
              label="From Date"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D] p-2"
            />
            <InputField
              label="To Date"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="focus:ring-2 focus:ring-[#660F5D] focus:border-[#660F5D] p-2"
            />
          </div>

          {/* Submit Button */}
          <Submit />
        </form>
      </div>
    </div>
  );
};

export default CreateOrganizationType;
