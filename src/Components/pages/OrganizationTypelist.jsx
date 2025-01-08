import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../common/Header";
import Table from "../../common/UserTable";
import Pagetitle from "../../common/pagetitle";

const OrganizationList = () => {
  const [organizationTypes, setOrganizationTypes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState(""); // Added filter state
  const [searchQuery, setSearchQuery] = useState(""); // Added search query state
  const orgsPerPage = 10;
  const navigate = useNavigate(); // Initialize navigate function

  const filterOptions = ["Dentist", "Dental Laboratory", "Radiology", "Material Supplier"]; // Correct filter options
  
  // Dummy organization types data (replace with actual data from your API)
  const loadOrganizationsForPage = (page, filter, searchQuery) => {
    const start = (page - 1) * orgsPerPage;
    const newOrgs = Array.from({ length: orgsPerPage }, (_, index) => ({
      type: filterOptions[index % filterOptions.length], // Alternate between types for demonstration
      fromdate: `2022-01-01`,
      todate: `2025-01-01`,
      id: start + index + 1,
    }));

    // Apply filter and search query
    const filteredOrgs = newOrgs.filter((org) => 
      (filter ? org.type === filter : true) && 
      (searchQuery ? org.type.toLowerCase().includes(searchQuery.toLowerCase()) : true)
    );

    setOrganizationTypes(filteredOrgs);
    setTotalPages(Math.ceil(filteredOrgs.length / orgsPerPage)); 
  };

  useEffect(() => {
    loadOrganizationsForPage(page, filter, searchQuery);
  }, [page, filter, searchQuery]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value); // Update filter state
    setPage(1); // Reset to the first page when filter changes
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value); // Update search query state
    setPage(1); // Reset to the first page when search query changes
  };

  const handleCreateOrganizationType = () => {
    // Navigate to the create organization type page
    navigate("/createorganizationtype");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="organization-list-container w-full md:pl-4 flex flex-col">
        <Header name={"Organization Types"} />

        <Pagetitle
          title="Organization Types List"
          buttonLabel="Create Organization Type"
          onButtonClick={handleCreateOrganizationType}
          filterValue={filter}
          onFilterChange={handleFilterChange}
          options={filterOptions}
          searchPlaceholder="Search organization types..."
          onSearch={handleSearch}
        />

        <Table
          columns={["Organization Type", "From Date", "To Date"]}
          fields={["type", "fromdate", "todate"]}
          data={organizationTypes}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />
      </div>
    </div>
  );
};

export default OrganizationList;
