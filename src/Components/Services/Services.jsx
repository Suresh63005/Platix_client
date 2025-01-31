import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../common/Header";
import Pagetitle from "../../common/pagetitle";
import Table from "../../common/UserTable";
import { servicesData } from "../../Data/data";

const Services = () => {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setOrganizations(servicesData);
  }, []);

  // Extract unique filter and role options
  const filterOptions = [...new Set(servicesData.map((service) => service.name))];
  const roleOptions = [...new Set(servicesData.map((service) => service.role))];

  // Filter and paginate the data like OrganizationList.js
  const filteredOrganizations = organizations
    .filter((org) => {
      const filterMatch = selectedFilter ? org.name === selectedFilter : true;
      const roleMatch = selectedRole ? org.role === selectedRole : true;
      const searchMatch = searchQuery
        ? org.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return filterMatch && roleMatch && searchMatch;
    });

  const paginatedOrganizations = filteredOrganizations.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredOrganizations.length / itemsPerPage);

  const handleEdit = (id) => {
    navigate("/createservice", { state: { id, mode: "edit" } });
  };

  const handleView = (id) => {
    navigate("/createservice", { state: { id, mode: "view" } });
  };

  return (
    <div className="bg-gray-100 h-full">
      <Header name={"Services"} />
      <Pagetitle
        title="Services List"
        buttonLabel="Create Service"
        onButtonClick={() => navigate("/createservice")}
        filterValue={selectedFilter}
        onFilterChange={(value) => {
          setSelectedFilter(value);
          setPage(1);
        }}
        options={filterOptions}
        searchPlaceholder="Search"
        onSearch={(e) => {
          setSearchQuery(e.target.value);
          setPage(1);
        }}
        showRoleAssign={true}
        roleValue={selectedRole}
        onRoleChange={(value) => {
          setSelectedRole(value);
          setPage(1);
        }}
        roleOptions={roleOptions}
        assignButtonLabel="Assign"
        onAssignClick={() => console.log("Assign clicked")}
        filterPlaceholder="Filter"
      />
      <div className="overflow-x-auto sm:overflow-x-visible">
        <Table
          columns={["Service Name", "From Date", "To Date"]}
          fields={["name", "fromdate", "todate"]}
          data={paginatedOrganizations}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          handleEdit={handleEdit}
          handleview={handleView}
        />
      </div>
    </div>
  );
};

export default Services;
