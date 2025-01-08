import React, { useState } from 'react';
import Header from '../../common/Header';
import ReportsTable from './ReportsTable';
import ReportsTitle from './ReportsTitle';

const UserReports = () => {
  const columns = [
    "Username",
    "User ID",
    "Role",
    "Address",
    "Mobile No.",
    "Starting Date",
  ];

  const columnKeyMapping = {
    "Username": "username",
    "User ID": "userId",
    "Role": "role",
    "Address": "address",
    "Mobile No.": "mobileNo",
    "Starting Date": "startingDate",
  };

  const initialData = [
    {
      id: 1,
      username: "John Doe",
      userId: "U001",
      role: "Admin",
      address: "123 Main St",
      mobileNo: "1234567890",
      startingDate: "2023-01-01",
    },
    {
      id: 2,
      username: "Jane Smith",
      userId: "U002",
      role: "User",
      address: "456 Elm St",
      mobileNo: "9876543210",
      startingDate: "2023-02-15",
    },
  ];

  const [filteredData, setFilteredData] = useState(initialData);

  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const result = initialData.filter(
      (item) =>
        item.username.toLowerCase().includes(lowerCaseQuery) ||
        item.role.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredData(result);
  };

  return (
    <div>
      <Header name="Reports" />
      <ReportsTitle
        title="User Reports"
        searchPlaceholder="Search by Username or Role..."
        onSearch={(e) => handleSearch(e.target.value)}
      />
      <div className="overflow-x-auto">
        <ReportsTable
          columns={columns}
          data={filteredData}
          columnKeyMapping={columnKeyMapping}  // Pass column key mapping dynamically
        />
      </div>
    </div>
  );
};

export default UserReports;
