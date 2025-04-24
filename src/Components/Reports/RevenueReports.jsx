import React, { useState, useEffect } from 'react';
import Header from '../../common/Header';
import ReportsTable from './ReportsTable';
import ReportsTitle from './ReportsTitle';
import axios from 'axios';
import api from '../../utils/api';

// Debounce function to delay search action
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

const RevenueReports = () => {
  const columns = [
    "Order ID",
    "Order Date",
    "From",
    "To",
    "Invoice Amount",
    "Paid Amount",
    "Balance",
    "Amount to Business",
    "Amount to Platix",
    "Mode of Payment",
  ];

  const columnKeyMapping = {
    "Order ID": "orderId",
    "Order Date": "orderDate",
    "From": "from",
    "To": "to",
    "Invoice Amount": "invoiceAmount",
    "Paid Amount": "paidAmount",
    "Balance": "balance",
    "Amount to Business": "amountToBusiness",
    "Amount to Platix": "amountToPlatix",
    "Mode of Payment": "modeOfPayment",
  };

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  
  // Debounced values
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let endpoint = "admin/getallorder";
        if (fromDate && toDate) {
          endpoint = `order/getbyorderdate/${fromDate}/${toDate}`;
        }
        
        const response = await api.get(endpoint);
        const orders = response.data.data || [];

        const formattedOrders = orders.map((order) => ({
          orderId: order.orderId || "N/A",
          orderDate: order.orderDate || "N/A",
          from: order.userDetails?.organization?.name || "N/A", 
          username: order.user?.firstName || "N/A",
          userContact: order.MobileNo || "N/A",
          to: order.toOrg?.name || "N/A", 
          contactName: order.patientName || "N/A",
          contactNumber: order.MobileNo || "N/A",
          invoice: order.id ? "INV-" + order.id.substring(0, 5) : "N/A", 
          amount: order.totalAmount || "N/A",
          paidAmount: order.paidAmount || "N/A",
          balance: (order.totalAmount && order.paidAmount) ? order.totalAmount - order.paidAmount : "N/A", 
          modeOfPayment: order.paymentMethod || "N/A",
        }));        

        setData(formattedOrders);
        setFilteredData(formattedOrders);
      } catch (err) {
        console.error("Error fetching data:", err);
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
      ...filteredData.map((row) => keys.map((key) => `"${row[key] || ''}"`).join(","))
    ];

    const csvContent = "\uFEFF" + csvRows.join("\r\n"); 
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Revenue_Reports.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

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
        title={"Revenue Reports"}
        searchPlaceholder="Search"
        onSearch={(e) => setSearchQuery(e.target.value)}
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={(e) => setFromDate(e.target.value)}
        onToDateChange={(e) => setToDate(e.target.value)}
        onDownloadClick={handleBulkDownload}
      />
      <div className="overflow-x-auto w-full">
        <ReportsTable
          columns={columns}
          data={filteredData}
          columnKeyMapping={columnKeyMapping}
        />
      </div>
    </div>
  );
};

export default RevenueReports;
