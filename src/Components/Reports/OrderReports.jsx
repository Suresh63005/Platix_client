import React, { useState } from 'react';
import Header from '../../common/Header';
import ReportsTable from './ReportsTable';
import ReportsTitle from './ReportsTitle';

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

  const initialData = [
    {
      id: 1,
      orderId: "O001",
      orderDate: "2023-01-01",
      from: "Dentist A",
      username: "John Doe",
      to: "Patient X",
      orderStatus: "Completed",
      mobileNo: "1234567890",
      patientDetails: "Patient details here",
    },
    {
      id: 2,
      orderId: "O002",
      orderDate: "2023-02-15",
      from: "Dentist B",
      username: "Jane Smith",
      to: "Patient Y",
      orderStatus: "Pending",
      mobileNo: "9876543210",
      patientDetails: "Patient details here",
    },
  ];

  const [filteredData, setFilteredData] = useState(initialData);

  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const result = initialData.filter(
      (item) =>
        item.orderId.toLowerCase().includes(lowerCaseQuery) ||
        item.username.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredData(result);
  };

  return (
    <div>
      <Header name={"Reports"} />
      <ReportsTitle
        title={"Order Reports"}
        searchPlaceholder="Search by Order ID or Username..."
        onSearch={(e) => handleSearch(e.target.value)}
      />
      <div className="overflow-x-auto">
        <ReportsTable
          columns={columns}
          data={filteredData}
          columnKeyMapping={columnKeyMapping}  // Pass column key mapping dynamically
        />
      </div>
    </div>
  );
};

export default OrderReports;
