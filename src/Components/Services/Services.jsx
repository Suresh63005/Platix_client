import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../common/Header";
import Pagetitle from "../../common/pagetitle";
import Table from "../../common/UserTable";

const Services = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("");  // The search filter for service name
  const [selectedRole, setSelectedRole] = useState("");      // The role filter from dropdown
  const [organizations, setOrganizations] = useState([
    {
      id: 1,
      name: "Service A",
      fromdate: "2023-12-01",
      todate: "2023-12-31",
      role: "Owner",
    },
    {
      id: 2,
      name: "Service B",
      fromdate: "2023-11-01",
      todate: "2023-11-30",
      role: "Technician",
    },
  ]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(organizations.length / itemsPerPage);

  // Handle filtered organizations based on both search filter and role filter
  const filteredOrganizations = organizations
    .filter((org) => {
      // Ensure that selectedFilter is a string before calling toLowerCase
      const filter = selectedFilter ? selectedFilter.toLowerCase() : ""; // Safe toLowerCase
      const role = selectedRole || "";

      // Filter by service name if the selectedFilter is not empty
      if (filter && !org.name.toLowerCase().includes(filter)) {
        return false;
      }

      // Filter by role if selectedRole is not empty
      if (role && org.role !== role) {
        return false;
      }

      return true;
    })
    .slice((page - 1) * itemsPerPage, page * itemsPerPage);  // Paginate the results

  const handleCreateServiceClick = () => {
    navigate("/createservice");
  };

  // Debugging for state updates
  useEffect(() => {
    console.log("selectedFilter:", selectedFilter);
    console.log("selectedRole:", selectedRole);
  }, [selectedFilter, selectedRole]);

  return (
    <div className="bg-gray-100 h-full">
      <Header name={"Services"} />
      <Pagetitle
        title="Services List"
        buttonLabel="Create Service"
        onButtonClick={handleCreateServiceClick}
        filterValue={selectedFilter}
        onFilterChange={(value) => setSelectedFilter(value)}  // Updated filter change handler
        options={["Service A", "Service B"]} // The options can be more dynamic, you can adjust accordingly
        searchPlaceholder="Search services..."
        onSearch={(e) => {
          const value = e.target.value;  // Extract the value from the input event
          setSelectedFilter(value); // Update the selectedFilter
        }}
        showRoleAssign={true}
        roleValue={selectedRole} // Pass selectedRole value to dropdown
        onRoleChange={(e) => {
          const value = e.target.value; // Extract the value from the select event
          setSelectedRole(value); // Update the selectedRole
        }}
        roleOptions={["Owner", "Technician", "Dentist"]} // The role options for the dropdown filter
        assignButtonLabel="Assign"
        onAssignClick={() => console.log("Assign Role clicked")}
        filterPlaceholder="Filter"
        selectPlaceholder="Select Role"
        customStyles={{
          roleSelect: "w-[200px]",
          searchInput: "w-[250px]",
        }}
      />

      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto sm:overflow-x-visible">
        <Table
          columns={["Service Name", "From Date", "To Date"]}
          fields={["name", "fromdate", "todate"]}
          data={filteredOrganizations} // Display the filtered organizations
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          setData={setOrganizations}
          renderRow={(org) => (
            <tr key={org.id}>
              <td>{org.name}</td>
              <td>{org.fromdate}</td>
              <td>{org.todate}</td>
              <td>{org.role}</td>
            </tr>
          )}
        />
      </div>
    </div>
  );
};

export default Services;
