import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../common/Header";
import Table from "../../common/UserTable";
import Pagetitle from "../../common/pagetitle";
import { organizationTypesData } from "../../Data/data"; 

// Debounced hook for search or filter
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

const OrganizationTypelist = () => {
  const [organizationTypes, setOrganizationTypes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState(""); // Filter state
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const orgsPerPage = 10;
  const navigate = useNavigate(); // Initialize navigate function

  const filterOptions = ["Dentist", "Dental Laboratory", "Radiology", "Material Supplier"]; // Filter options

  // Debounced filter and search query
  const debouncedFilter = useDebounce(filter, 500);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Dummy organization types data (replace with actual data from your API)
  const loadOrganizationsForPage = (page, filter, searchQuery) => {
    const start = (page - 1) * orgsPerPage;
    let filteredOrgs = organizationTypesData;

    if (filter) {
      filteredOrgs = filteredOrgs.filter((org) => org.type === filter);
    }

    if (searchQuery) {
      filteredOrgs = filteredOrgs.filter((org) =>
        org.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const paginatedOrgs = filteredOrgs.slice(start, start + orgsPerPage);

    setOrganizationTypes(paginatedOrgs);
    setTotalPages(Math.ceil(filteredOrgs.length / orgsPerPage));
  };

  useEffect(() => {
    loadOrganizationsForPage(page, debouncedFilter, debouncedSearchQuery);
  }, [page, debouncedFilter, debouncedSearchQuery]);

  const handleFilterChange = (value) => {
    setFilter(value);
    setPage(1);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value); // Update search query state
    setPage(1); // Reset to the first page when search query changes
  };

  const handleCreateOrganizationType = () => {
    navigate("/createorganizationtype");
  };
  const handleEdit = (id)=>{
    navigate("/createorganizationtype",{state: {id,mode:"edit"}})
  }
  const handleview = (id)=>{
    navigate("/createorganizationtype",{state: {id,mode:"view"}})
  }
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <div className="organization-list-container w-full md:pl-0 flex flex-col">
        <Header name={"Organization Type"} />

        <Pagetitle
          title="Organization Types List"
          buttonLabel="Create Organization Type"
          onButtonClick={handleCreateOrganizationType}
          filterValue={filter}
          onFilterChange={handleFilterChange}
          options={filterOptions}
          searchPlaceholder="Search"
          onSearch={handleSearch}
          filterPlaceholder={"Filter"}
        />

        <Table
          columns={["Organization Type", "From Date", "To Date"]}
          fields={["type", "fromdate", "todate"]}
          data={organizationTypes}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          setData={setOrganizationTypes}
          handleEdit={handleEdit}
          handleview={handleview}
        />
      </div>
    </div>
  );
};

export default OrganizationTypelist;
