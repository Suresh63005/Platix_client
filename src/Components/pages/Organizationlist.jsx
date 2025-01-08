import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../common/Header";
import Table from "../../common/UserTable";
import Pagetitle from "../../common/pagetitle";
import UserICon from '../../assets/images/Users icon.svg'; // Import the user icon image

const OrganizationList = () => {
  const [organizations, setOrganizations] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState(""); // Added filter state
  const [searchQuery, setSearchQuery] = useState(""); // Added search query state
  const orgsPerPage = 10;
  const navigate = useNavigate(); // Initialize navigate function

  const filterOptions = ["Dentist", "Dental Laboratory", "Radiology", "Material Supplier"]; // Filter options
  
  // Dummy organizations data (replace with actual data from your API)
  const loadOrganizationsForPage = (page, filter, searchQuery) => {
    const start = (page - 1) * orgsPerPage;
    const newOrgs = Array.from({ length: orgsPerPage }, (_, index) => ({
      name: `Organization ${start + index + 1}`,
      type: index % 2 === 0 ? "Dentist" : "Radiology",
      mobile: `+1 123-456-789${index}`,
      id: start + index + 1,
    }));

    // Apply filter and search query
    const filteredOrgs = newOrgs.filter((org) => 
      (filter ? org.type === filter : true) && 
      (searchQuery ? org.name.toLowerCase().includes(searchQuery.toLowerCase()) : true)
    );

    setOrganizations(filteredOrgs);
    setTotalPages(Math.ceil(filteredOrgs.length / orgsPerPage)); 
  };

  useEffect(() => {
    loadOrganizationsForPage(page, filter, searchQuery);
  }, [page, filter, searchQuery]);

  const handleIconClick = () => {
    navigate(`/userpage`);
  };

  const renderUserIcon = () => (
    <div
      className="flex items-center justify-center py-2 px-7 rounded-sm cursor-pointer"
      style={{ backgroundColor: "#660F5D1A" }}
      onClick={handleIconClick}
    >
      <img src={UserICon} alt="User Icon" className="w-5 h-5" />
    </div>
  );

  const handleFilterChange = (value) => {
    setFilter(value); // Update filter state
    setPage(1); // Reset to the first page when filter changes
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value); // Update search query state
    setPage(1); // Reset to the first page when search query changes
  };

  const handleCreateOrganization = () => {
    // Navigate to the create organization page
    navigate("/createorganization");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="organization-list-container w-full md:pl-4 flex flex-col">
        <Header name={"Organizations"} />

        <Pagetitle
          title="Organization List"
          buttonLabel="Create Organization"
          onButtonClick={handleCreateOrganization}
          filterValue={filter}
          onFilterChange={handleFilterChange}
          options={filterOptions}
          searchPlaceholder="Search organizations..."
          onSearch={handleSearch}
        />

<Table
  columns={["Organization Name", "Organization Type", "Mobile No", "Users"]}
  fields={["name", "type", "mobile", "icon"]}
  data={organizations.map((org) => ({
    ...org,
    icon: renderUserIcon(),
  }))}
  page={page}
  totalPages={totalPages}
  setPage={setPage}
  setData={setOrganizations}  // Pass setOrganizations as setData
/>
      </div>
    </div>
  );
};

export default OrganizationList;
