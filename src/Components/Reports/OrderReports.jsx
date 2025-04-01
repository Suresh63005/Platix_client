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
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let endpoint = "order/getallorderedreport";
        if (fromDate && toDate) {
          endpoint = `order/getbyorderdate/${fromDate}/${toDate}`;
        }
        console.log(endpoint)
        const response = await api.get(endpoint);
        const apiData = response.data.data || [];
        console.log(apiData,"dddddddddddddddddata")

        const formattedData = apiData.map((order) => ({
          id: order.id || "N/A",
          orderId: order.orderId || "N/A",
          orderDate: order.orderDate || "N/A",
          from: order.fromOrg?.name || "N/A",
          username: order.userDetails?.firstName || "N/A",
          to: order.toOrg?.name || "N/A",
          orderStatus: order.orderStatus || "N/A",
          mobileNo: order.userDetails?.mobileNo || "N/A",
          patientDetails: order.patientName || "N/A",
        }));

        setData(formattedData);
        setFilteredData(formattedData);
      } catch (error) {
        console.error("Error fetching order reports:", error);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

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
      ...filteredData.map((row) => keys.map((key) => `"${row[key] || ''}"`).join(",")),
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