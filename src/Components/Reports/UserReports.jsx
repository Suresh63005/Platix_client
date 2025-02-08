import React, { useState, useEffect } from 'react';
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
    "Username": "Username",
    "User ID": "id",
    "Role": "Role",
    "Address": "Address",
    "Mobile No.": "MobileNo",
    "Starting Date": "StartDate",
  };

  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/user/all');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setFilteredData(data); // Assuming the API response is an array of users
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run this effect only once when the component mounts

  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const result = filteredData.filter(
      (item) =>
        item.username.toLowerCase().includes(lowerCaseQuery) ||
        item.role.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredData(result);
  };

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loader component
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
