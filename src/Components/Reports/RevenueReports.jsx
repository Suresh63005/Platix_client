import React, { useState, useEffect } from 'react';
import Header from '../../common/Header';
import ReportsTable from './ReportsTable';
import ReportsTitle from './ReportsTitle';

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

  const initialData = [
    {
      id: 1,
      orderId: "R001",
      orderDate: "2023-01-01",
      from: "Dentist A",
      to: "Patient X",
      invoiceAmount: "100",
      paidAmount: "50",
      balance: "50",
      amountToBusiness: "40",
      amountToPlatix: "10",
      modeOfPayment: "Credit",
    },
    {
      id: 2,
      orderId: "R002",
      orderDate: "2023-02-15",
      from: "Dentist B",
      to: "Patient Y",
      invoiceAmount: "200",
      paidAmount: "150",
      balance: "50",
      amountToBusiness: "120",
      amountToPlatix: "30",
      modeOfPayment: "Cash",
    },
  ];

  const [filteredData, setFilteredData] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState("");

  // Using debounced search value
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedSearchQuery) {
      const lowerCaseQuery = debouncedSearchQuery.toLowerCase();
      const result = initialData.filter(
        (item) =>
          item.orderId.toLowerCase().includes(lowerCaseQuery) ||
          item.from.toLowerCase().includes(lowerCaseQuery) ||
          item.to.toLowerCase().includes(lowerCaseQuery)
      );
      if (JSON.stringify(result) !== JSON.stringify(filteredData)) {
        setFilteredData(result);
      }
    } else {
      if (JSON.stringify(initialData) !== JSON.stringify(filteredData)) {
        setFilteredData(initialData);
      }
    }
  }, [debouncedSearchQuery, initialData, filteredData]);
  
  

  return (
    <div>
      <Header name={"Reports"} />
      <ReportsTitle
        title={"Revenue Reports"}
        searchPlaceholder="Search "
        onSearch={(e) => setSearchQuery(e.target.value)} // Set search query on input change
      />
      <div className="overflow-x-auto w-full">
        {/* Reports Table */}
        <ReportsTable
          columns={columns}
          data={filteredData}
          columnKeyMapping={columnKeyMapping} // Pass column key mapping dynamically
        />
      </div>
    </div>
  );
};

export default RevenueReports;

