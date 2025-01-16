import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../common/Header";
import Table from "../../common/UserTable";
import Pagetitle from "../../common/pagetitle";

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

const OrganizationList = () => {
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

    // Create dummy data
    const newOrgs = Array.from({ length: orgsPerPage }, (_, index) => ({
      type: filterOptions[index % filterOptions.length], // Alternate between types
      fromdate: `2022-01-01`,
      todate: `2025-01-01`,
      id: start + index + 1,
    }));

    // Apply filter and search query (case insensitive)
    const filteredOrgs = newOrgs.filter((org) => {
      const matchesFilter = filter ? org.type.toLowerCase() === filter.toLowerCase() : true;
      const matchesSearchQuery = searchQuery
        ? org.type.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      return matchesFilter && matchesSearchQuery;
    });

    // Set the filtered data
    setOrganizationTypes(filteredOrgs);
    setTotalPages(Math.ceil(filteredOrgs.length / orgsPerPage)); // Set the total pages
  };

  useEffect(() => {
    loadOrganizationsForPage(page, debouncedFilter, debouncedSearchQuery);
  }, [page, debouncedFilter, debouncedSearchQuery]);

  const handleFilterChange = (event) => {
    if (event && event.target) {
      setFilter(event.target.value); // Update filter state
      setPage(1); // Reset to the first page when filter changes
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value); // Update search query state
    setPage(1); // Reset to the first page when search query changes
  };

  const handleCreateOrganizationType = () => {
    navigate("/createorganizationtype");
  };

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
          searchPlaceholder="Search..."
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
        />
      </div>
    </div>
  );
};

export default OrganizationList;
