import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../common/Header";
import Pagetitle from "../../common/pagetitle";
import Table from "../../common/UserTable";

const Services = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
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
  const [selectedServices, setSelectedServices] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(organizations.length / itemsPerPage);

  const handleServiceChange = (id) => {
    setSelectedServices((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((serviceId) => serviceId !== id);
      } else {
        const newSelected = [...prevSelected, id];
        if (newSelected.length === organizations.length) {
          return organizations.map((org) => org.id);
        }
        return newSelected;
      }
    });
  };

  const filteredOrganizations = organizations
    .filter((org) => {
      if (
        selectedFilter &&
        !org.name.toLowerCase().includes(selectedFilter.toLowerCase())
      ) {
        return false;
      }
      if (selectedRole && org.role !== selectedRole) {
        return false;
      }
      return true;
    })
    .slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleCreateServiceClick = () => {
    navigate("/createservice");
  };

  return (
    <div className="bg-gray-100 h-full">
      <Header name={"Services"} />
      <Pagetitle
        title="Services List"
        buttonLabel="Create Service"
        onButtonClick={handleCreateServiceClick}
        filterValue={selectedFilter}
        onFilterChange={(value) => setSelectedFilter(value)}
        options={["Service A", "Service B"]}
        searchPlaceholder="Search services..."
        onSearch={(e) => setSelectedFilter(e.target.value)}
        showRoleAssign={true}
        roleValue={selectedRole}
        onRoleChange={(value) => setSelectedRole(value)}
        roleOptions={["Owner", "Technician", "Dentist"]}
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
          columns={["Service Name", "From Date", "To Date"]} // Removed "Select" column
          fields={["name", "fromdate", "todate"]} // Adjusted fields accordingly
          data={filteredOrganizations}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          setData={setOrganizations}
          renderRow={(org) => (
            <tr key={org.id}>
              <td>{org.name}</td>
              <td>{org.fromdate}</td>
              <td>{org.todate}</td>
              <td>{org.users}</td>
            </tr>
          )}
        />
      </div>
    </div>
  );
};

export default Services;
