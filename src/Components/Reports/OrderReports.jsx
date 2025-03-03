import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../common/Header';
import ReportsTable from './ReportsTable';
import ReportsTitle from './ReportsTitle';
import api from '../../utils/api';

const OrderReports = () => {
  const columns = [
    "Order ID",
    "Order Date",
    "From",
    "Username",
    "To",
    "Order Status",
    "Mobile No",
    "Patient Details",
  ];

  const columnKeyMapping = {
    "Order ID": "orderId",
    "Order Date": "orderDate",
    "From": "from",
    "Username": "username",
    "To": "to",
    "Order Status": "orderStatus",
    "Mobile No": "mobileNo",
    "Patient Details": "patientDetails",
  };

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    // State for date range filter
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {

        let endpoint = "admin/getallorder";
      if (fromDate && toDate) {
        endpoint = `user/getbydate/${fromDate}/${toDate}`;
      }
      
      const response = await api.get(endpoint);
      const apiData = response.data.data || [];
        console.log(apiData)
        // Transform API response to match table format
        const formattedData = apiData.map((order) => ({
          id: order.id ? order.id :"N/A",
          orderId: order.id ? order.id :"N/A",
          orderDate: order.orderDate ? order.orderDate :"N/A",
          from: order.fromOrg?.organizationType || "N/A",
          username: order.user?.firstName || "N/A",
          to: order.toOrg?.organizationType || "N/A",
          orderStatus: order.orderStatus ? order.orderStatus :"N/A",
          mobileNo: order.MobileNo ? order.MobileNo :"N/A",
          patientDetails: order.patientName ? order.patientName :"N/A",
        }));

        setData(formattedData);
        setFilteredData(formattedData);
      } catch (error) {
        console.error("Error fetching order reports:", error);
        setError("Failed to load data");
      }finally{
        setLoading(false);
      }
    };

    fetchData();
  }, [fromDate,toDate]);

  // Handle search
  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const result = data.filter(
      (item) =>
        item.orderId.toLowerCase().includes(lowerCaseQuery) ||
        item.username.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredData(result);
  };

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
    link.setAttribute("download", "Order_Reports.csv");
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
      <Header name={"Reports"} />
      <ReportsTitle
        title={"Order Reports"}
        searchPlaceholder="Search"
        onSearch={(e) => handleSearch(e.target.value)}
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={(e) => setFromDate(e.target.value)}
        onToDateChange={(e) => setToDate(e.target.value)}
        onDownloadClick={()=>{handleBulkDownload()}}
      />
      <div className="overflow-x-auto report-table">
        <ReportsTable
          columns={columns}
          data={filteredData}
          columnKeyMapping={columnKeyMapping}
        />
      </div>
    </div>
  );
};

export default OrderReports;
