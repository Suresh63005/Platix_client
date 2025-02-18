import React, { useState, useEffect } from "react";
import Header from "../../common/Header";
import ReportsTable from "./ReportsTable";
import ReportsTitle from "./ReportsTitle";
import api from "../../utils/api";

// Debounce Hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const UserReports = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

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
    "User ID": "id",
    "Role": "role",
    "Address": "address",
    "Mobile No.": "mobileNo",
    "Starting Date": "createdAt",
  };

  // Fetch data when component mounts or date filters change
  const fetchData = async () => {
    setLoading(true);
    try {
      let endpoint = "user/all";
      if (fromDate && toDate) {
        endpoint = `user/getbydate/${fromDate}/${toDate}`;
      }

      const response = await api.get(endpoint);
      const apiData = response.data.users || [];

      const formattedData = apiData.map((user) => ({
        id: user.id || "N/A",
        username: user.Username || "N/A",
        role: user.Role || "N/A",
        address: user.address || "N/A",
        mobileNo: user.mobileNo || "N/A",
        createdAt: user.createdAt || "N/A",
      }));

      setData(formattedData);
      setFilteredData(formattedData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fromDate, toDate]);

  // Apply search filtering using debounce
  useEffect(() => {
    if (debouncedSearchQuery) {
      const lowerCaseQuery = debouncedSearchQuery.toLowerCase();

      const result = data.filter((item) =>
        Object.values(columnKeyMapping).some(
          (key) => item[key] && item[key].toString().toLowerCase().includes(lowerCaseQuery)
        )
      );

      setFilteredData(result);
    } else {
      setFilteredData(data);
    }
  }, [debouncedSearchQuery, data]);

  const handleBulkDownload = () => {
    if (!filteredData.length) {
      alert("No data available for download!");
      return;
    }

    const headers = Object.keys(columnKeyMapping);
    const keys = Object.values(columnKeyMapping);

    const csvRows = [
      headers.join(","),
      ...filteredData.map((row) => keys.map((key) => `"${row[key] || ''}"`).join(",")),
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
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-5">Error: {error}</div>;
  }

  return (
    <div className="bg-gray-100 h-full">
      <Header name="Reports" />
      <ReportsTitle
        title="User Reports"
        searchPlaceholder="Search"
        onSearch={(e) => setSearchQuery(e.target.value)}
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={(e) => setFromDate(e.target.value)}
        onToDateChange={(e) => setToDate(e.target.value)}
        onDownloadClick={handleBulkDownload}
      />
      <div className="overflow-x-auto">
        <ReportsTable columns={columns} data={filteredData} columnKeyMapping={columnKeyMapping} />
      </div>
    </div>
  );
};

export default UserReports;
