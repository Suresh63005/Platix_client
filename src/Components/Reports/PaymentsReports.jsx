import React, { useState, useEffect } from "react";
import Header from "../../common/Header";
import ReportsTable from "./ReportsTable";
import ReportsTitle from "./ReportsTitle";

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
  const columns = [
    "Order ID",
    "Order Date",
    "From",
    "Username",
    "User Contact",
    "To",
    "Contact Name",
    "Contact Number",
    "Invoice",
    "Amount",
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
    "Invoice": "invoice",
    "Amount": "amount",
    "Paid amount": "paidAmount",
    "Balance": "balance",
    "Mode of Payment": "modeOfPayment",
  };

  const initialData = [
    {
      id: 1,
      orderId: "P001",
      orderDate: "2023-01-01",
      from: "Dentist A",
      username: "John Doe",
      userContact: "1234567890",
      to: "Patient X",
      contactName: "Patient X",
      contactNumber: "1234567890",
      invoice: "INV001",
      amount: "100",
      paidAmount: "50",
      balance: "50",
      modeOfPayment: "Credit",
    },
    {
      id: 2,
      orderId: "P002",
      orderDate: "2023-02-15",
      from: "Dentist B",
      username: "Jane Smith",
      userContact: "9876543210",
      to: "Patient Y",
      contactName: "Patient Y",
      contactNumber: "9876543210",
      invoice: "INV002",
      amount: "200",
      paidAmount: "150",
      balance: "50",
      modeOfPayment: "Cash",
    },
  ];

  const [filteredData, setFilteredData] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedSearchQuery) {
      const lowerCaseQuery = debouncedSearchQuery.toLowerCase();
      const result = initialData.filter(
        (item) =>
          item.orderId.toLowerCase().includes(lowerCaseQuery) ||
          item.username.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredData(result);
    } else {
      setFilteredData(initialData);
    }
  }, [debouncedSearchQuery]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <div className="w-full md:pl-0 flex flex-col">
        <Header name={"Reports"} />
        <ReportsTitle
          title={"Payments Reports"}
          searchPlaceholder="Search"
          onSearch={(e) => setSearchQuery(e.target.value)}
        />
        <div className="w-full flex-grow"> {/* Ensures layout takes full height */}
          {/* Table container with scroll */}
          <div className=""> {/* Adjust height to exclude header and title space */}
            <ReportsTable
              columns={columns}
              data={filteredData}
              columnKeyMapping={columnKeyMapping}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsReports;
