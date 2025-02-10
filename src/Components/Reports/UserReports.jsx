import React, { useState, useEffect } from 'react';
import Header from '../../common/Header';
import ReportsTable from './ReportsTable';
import ReportsTitle from './ReportsTitle';
import axios from 'axios';
import api from '../../utils/api';

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
    "Username": "Username",
    "User ID": "id",
    "Role": "Role",
    "Address": "address",
    "Mobile No.": "mobileNo",
    "Starting Date": "startDate",
  };

  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('user/all');
        const data = await response.data.users;
        setFilteredData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const result = filteredData.filter(
      (item) =>
        item.username.toLowerCase().includes(lowerCaseQuery) ||
        item.role.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredData(result);
  };

  // Function to handle bulk download
  const handleBulkDownload = () => {
    console.log("Download button clicked!"); // ✅ Debugging log
  
    if (!filteredData.length) {
      alert("No data available for download!");
      return;
    }
  
    const headers = Object.keys(columnKeyMapping);
    const keys = Object.values(columnKeyMapping);
  
    const csvRows = [
      headers.join(","), 
      ...filteredData.map((row) => keys.map((key) => `"${row[key] || ''}"`).join(",")) 
    ];
  
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
  
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "User_Reports.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='bg-gray-100 h-full'>
      <Header name="Reports" />
      <ReportsTitle
        title="User Reports"
        searchPlaceholder="Search"
        onSearch={(e) => handleSearch(e.target.value)}
        onDownloadClick={()=>{handleBulkDownload()}} 
      />

      <div className="overflow-x-auto">
        <ReportsTable
          columns={columns}
          data={filteredData}
          columnKeyMapping={columnKeyMapping}
        />
      </div>
    </div>
  );
};

export default UserReports;
