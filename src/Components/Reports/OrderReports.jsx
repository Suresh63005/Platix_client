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

const OrderReports = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

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

  const fetchData = async () => {
    setLoading(true);
    try {
      let endpoint = "order/getallorderedreport";
      if (fromDate && toDate) {
        endpoint = `order/getbyorderdate/${fromDate}/${toDate}`;
      }

      const response = await api.get(endpoint);
      const apiData = response.data.data || [];
      
      const formattedData = apiData.map((order, index) => ({
        id: `order${(index + 1).toString().padStart(4, '0')}`,
        orderId: order?.orderId || "N/A",
        orderDate: order?.orderDate || "N/A",
        from: order?.fromOrg?.name || "N/A",
        username: order?.user?.firstName || "N/A",
        to: order?.toOrg?.name || "N/A",
        orderStatus: order?.orderStatus || "N/A",
        mobileNo: order?.mobileNo || "N/A",
        patientDetails: order?.patientName || "N/A",
      }));

      setData(formattedData);
      setFilteredData(formattedData);
    } catch (err) {
      console.error("Error fetching order reports:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fromDate, toDate]);

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
      ...filteredData.map((row) => keys.map((key) => `"${row[key] || ''}"`).join(","))
    ];

    const csvContent = "\uFEFF" + csvRows.join("\r\n"); 
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Order_Reports.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    };


  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-5">Error: {error}</div>;

  return (
    <div className="bg-gray-100 h-full">
      <Header name="Reports" />
      <ReportsTitle
        title="Order Reports"
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

export default OrderReports;
