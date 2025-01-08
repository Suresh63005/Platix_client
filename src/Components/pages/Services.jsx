import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Header from "../../common/Header";
import Pagetitle from "../../common/pagetitle";
import Table from "../../common/UserTable"; // Assuming you have this component

const Services = () => {
  const navigate = useNavigate(); // Initialize navigate hook
  const [selectedFilter, setSelectedFilter] = useState(""); // Filter for Service
  const [selectedRole, setSelectedRole] = useState(""); // Filter for Role
  const [organizations, setOrganizations] = useState([
    { id: 1, name: "Service A", fromdate: "2023-12-01", todate: "2023-12-31", users: 10, role: "Owner" },
    { id: 2, name: "Service B", fromdate: "2023-11-01", todate: "2023-11-30", users: 15, role: "Technician" },
    // Add more data as required
  ]);
  const [selectedServices, setSelectedServices] = useState([]); // Track selected services
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(organizations.length / itemsPerPage);

  // Handle individual service checkbox selection
  const handleServiceChange = (id) => {
    setSelectedServices((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((serviceId) => serviceId !== id); // Deselect service
      } else {
        const newSelected = [...prevSelected, id]; // Select service
        if (newSelected.length === organizations.length) {
          // If all services are selected, select all services
          return organizations.map((org) => org.id);
        }
        return newSelected;
      }
    });
  };

  // Function to filter the organizations based on selected filter and role
  const filteredOrganizations = organizations
    .filter((org) => {
      if (selectedFilter && !org.name.toLowerCase().includes(selectedFilter.toLowerCase())) {
        return false;
      }
      if (selectedRole && org.role !== selectedRole) {
        return false;
      }
      return true;
    })
    .slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Handle "Create Service" button click
  const handleCreateServiceClick = () => {
    navigate("/createservice"); // Navigate to /createservice
  };

  return (
    <div>
      {/* Header */}
      <Header name={"Services"} />

      {/* Page Title with Filters */}
      <Pagetitle
        title="Services List"
        buttonLabel="Create Service"
        onButtonClick={handleCreateServiceClick} // Trigger navigation on button click
        filterValue={selectedFilter}
        onFilterChange={(value) => setSelectedFilter(value)}
        options={["Service A", "Service B"]} // Example filter options
        searchPlaceholder="Search services..." // Placeholder for search input
        onSearch={(e) => setSelectedFilter(e.target.value)} // Use search to filter services
        showRoleAssign={true}
        roleValue={selectedRole}
        onRoleChange={(value) => setSelectedRole(value)}
        roleOptions={["Owner", "Technician", "Dentist"]} // Role options
        assignButtonLabel="Assign"
        onAssignClick={() => console.log("Assign Role clicked")}
        filterPlaceholder="Filter" // Placeholder for filter dropdown
        selectPlaceholder="Select Role" // Placeholder for role dropdown
        // Apply custom widths
        customStyles={{
          roleSelect: "w-[200px]", // Set width of role dropdown to 200px
          searchInput: "w-[250px]", // Set width of search input to 250px
        }}
      />

      {/* Table Component */}
      <Table
        columns={["Select", "Service Name", "From Date", "To Date", "Users"]}
        fields={["id", "name", "fromdate", "todate", "users"]}
        data={filteredOrganizations} // Use filtered and paginated data
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        setData={setOrganizations}
        renderRow={(org) => (
          <tr key={org.id}>
            {/* Select Checkbox */}
            <td>
              <input
                type="checkbox"
                checked={selectedServices.includes(org.id)} // Check if service is selected
                onChange={() => handleServiceChange(org.id)} // Toggle selection
              />
            </td>
            <td>{org.name}</td>
            <td>{org.fromdate}</td>
            <td>{org.todate}</td>
            <td>{org.users}</td>
          </tr>
        )}
      />
    </div>
  );
};

export default Services;
