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
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

const handleEdit = (id) =>{
  navigate("/createservice",{state:{id,mode:"edit"}})
}
const handleview = (id) =>{
  navigate("/createservice",{state:{id,mode:"view"}})
}

  useEffect(() => {
    setOrganizations(servicesData);
  }, []);

  const filterOptions = [...new Set(servicesData.map((service) => service.name))].map((name) => ({
    value: name,
    label: name,
  }));

  const roleOptions = [...new Set(servicesData.map((service) => service.role))].map((role) => ({
    value: role,
    label: role,
  }));

  const filteredOrganizations = organizations
    .filter((org) => {
      const filterMatch = selectedFilter
        ? org.name.toLowerCase().includes(selectedFilter.toLowerCase())
        : true;
      const roleMatch = selectedRole ? org.role === selectedRole : true;
      return filterMatch && roleMatch;
    })
    .slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const totalPages = Math.ceil(
    organizations.filter((org) => {
      const filterMatch = selectedFilter
        ? org.name.toLowerCase().includes(selectedFilter.toLowerCase())
        : true;
      const roleMatch = selectedRole ? org.role === selectedRole : true;
      return filterMatch && roleMatch;
    }).length / itemsPerPage
  );

  return (
    <div className="bg-gray-100 h-full">
      <Header name={"Services"} />
      <Pagetitle
        title="Services List"
        buttonLabel="Create Service"
        onButtonClick={() => navigate("/createservice")}
        filterValue={selectedFilter}
        onFilterChange={setSelectedFilter}
        options={filterOptions}
        searchPlaceholder="Search"
        onSearch={(e) => setSelectedFilter(e.target.value)}
        showRoleAssign={true}
        roleValue={selectedRole}
        onRoleChange={setSelectedRole}
        roleOptions={roleOptions}
        assignButtonLabel="Assign"
        onAssignClick={() => console.log("Assign clicked")}
        filterPlaceholder="Filter"
      />
      <div className="overflow-x-auto sm:overflow-x-visible">
        <Table
          columns={["Service Name", "From Date", "To Date"]}
          fields={["name", "fromdate", "todate"]}
          data={filteredOrganizations}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          handleEdit={handleEdit}
          handleview={handleview}
        />
      </div>
    </div>
  );
};

export default Services;
