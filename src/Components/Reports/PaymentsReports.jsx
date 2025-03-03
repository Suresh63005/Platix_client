import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../common/Header";
import ReportsTable from "./ReportsTable";
import ReportsTitle from "./ReportsTitle";
import api from "../../utils/api";

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

const PaymentsReports = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const debouncedFromDate = useDebounce(fromDate, 500);
  const debouncedToDate = useDebounce(toDate, 500);

  const columns = [
    "Order ID",
    "Order Date",
    "From",
    "Username",
    "User Contact no",
    "To",
    "Contact Name",
    "Contact Number",
    // "Invoice",
    "Invoice Amount",
    "Paid amount",
    "Balance",
    "Mode of Payment",
  ];

  const columnKeyMapping = {
    "Order ID": "orderId",
    "Order Date": "orderDate",
    "From": "from",
    "Username": "username",
    "User Contact": "userContact",
    "To": "to",
    "Contact Name": "contactName",
    "Contact Number": "contactNumber",
    "Invoice Amount": "amount",
    "Paid amount": "paidAmount",
    "Balance": "balance",
    "Mode of Payment": "modeOfPayment",
  };

  // Fetch data when date filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state before fetching

        let endpoint = "admin/getallorder";
      if (fromDate && toDate) {
        endpoint = `order/getbyorderdate/${fromDate}/${toDate}`;
      }
      
      const response = await api.get(endpoint);
      const apiData = response.data.data || [];


      const formattedOrders = apiData.map((order) => ({
        orderId: order.orderId || "N/A",
        orderDate: order.orderDate || "N/A",
        from: order.fromOrg?.name || "N/A",
        username: order.user?.firstName || "N/A",
        userContact: order.MobileNo || "N/A",
        to: order.toOrg?.name || "N/A",  // Extracting the actual string value here as well
        contactName: order.patientName || "N/A",
        contactNumber: order.MobileNo || "N/A",
        invoice: "INV-" + (order.id ? order.id.substring(0, 5) : "N/A"),  // Safely handling the case if order.id is missing
        amount: order.totalAmount || "N/A",
        paidAmount: order.paidAmount || "N/A",
        balance: (order.totalAmount && order.paidAmount) ? order.totalAmount - order.paidAmount : "N/A",  // Handling the balance calculation
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

  // Handle search filtering
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

    console.log(headers,"headersssssssssssssssssss");
    console.log(keys,"keysssssssssssssssssssssssss");

    filteredData.map((row) => keys.map((key) => console.log(row[key],"111111111111111111111111111111111111111" ) ));

    // Generate the rows of CSV based on the keys
    const csvRows = [
      headers.join(","), // Column headers
      ...filteredData.map((row) =>
        keys
          .map((key) => `"${row[key] || ''}"`) // Extract the value for each column
          .join(",")
      ),
    ];

  
    // Create CSV content
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
  
    console.log(csvContent,"csvContent from paymentreportsssssss");

    // Encode and create a download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Payment_Reports.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  
  
  if (loading) {
    return <div className="text-center w-[100vw] h-[100vh] mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-5">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <div className="w-full md:pl-0 flex flex-col">
        <Header name="Reports" />
        <ReportsTitle
          title="Payments Reports"
          searchPlaceholder="Search"
          onSearch={(e) => setSearchQuery(e.target.value)}
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={(e) => setFromDate(e.target.value)}
          onToDateChange={(e) => setToDate(e.target.value)}
          onDownloadClick={()=>{handleBulkDownload()}}
        />

        <div className="w-full flex-grow">
          {loading ? (
            <p className="text-center text-gray-500 mt-5">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500 mt-5">{error}</p>
          ) : (
            <div className="">
              <ReportsTable
                columns={columns}
                data={filteredData}
                columnKeyMapping={columnKeyMapping}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentsReports;