import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../common/Header";
import Table from "../../common/UserTable";
import Pagetitle from "../../common/pagetitle";
import Swal from "sweetalert2"; // Import SweetAlert
import axios from "axios";
import TickSquare from "../../assets/images/TickSquare.svg";
import { deleteItem } from "../../utils/delteEntity";
import api from "../../utils/api";
import Cookies from "js-cookie";
// import { organizationTypesData } from "../../Data/data";


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
  const [selectedItems, setSelectedItems] = useState([]);
  const [organizationTypes, setOrganizationTypes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState("");
  const [filterOptions,setFilterOptions] = useState([])// Filter state
  
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const orgsPerPage = 10;
  const navigate = useNavigate(); // Initialize navigate function

  // const filterOptions = ["Dentist", "Dental Laboratory", "Radiology", "Material Supplier"]; // Filter options

  // Debounced filter and search query
  const debouncedFilter = useDebounce(filter, 500);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Load data from API
  const loadOrganizationsForPage = (page, filter, searchQuery) => {
    const start = (page - 1) * orgsPerPage;
    
    // Set your API endpoint
    const apiUrl = "organization/getall";
    
    api
      .get(apiUrl, {
        params: {
          page,
          limit: orgsPerPage,
          filter,
          search: searchQuery
        },
      })
      .then((response) => {
        const { data } = response;
        // console.log("API Response:", data); // Log response for debugging
        const filteredOrgs = data.results; 
        setOrganizationTypes(filteredOrgs);
        
        setTotalPages(Math.ceil(data.totalCount / orgsPerPage));
      })
      .catch((error) => {
        console.error("Error fetching organizations:", error);
      });
  };
  useEffect(() => {
    const fetchOrganizationTypes = async () => {
      const token = Cookies.get("token"); 
  
      try {
        const response = await api.get("/organization/getall", {
          headers: { Authorization: `Bearer ${token}` }, 
        });
  
        console.log("Organization Types Response:", response.data);
  
        if (response.data && Array.isArray(response.data.results)) {
          
          setFilterOptions(
            response.data.results.map((org) => ({
              value: org.organizationType, // Use organizationType as value
              label: org.organizationType || "N/A", // Use organizationType as label, fallback to "N/A"
            }))
          );
        } else {
          setFilterOptions([]); // Ensure it's always an array
        }
      } catch (error) {
        console.error("Error fetching organization types:", error);
        setFilterOptions([]); // Fallback to empty array on error
      }
    };
  
    fetchOrganizationTypes();
  }, []);
  
  
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
  const handleEdit = (id) => {
    navigate("/createorganizationtype", { state: { id, mode: "edit" } });
  };
  const handleView = (id) => {
    navigate("/createorganizationtype", { state: { id, mode: "view" } });
  };

  const handleDelete = (id, forceDelete = false) => {
    // const url=
    deleteItem("organization/delete", id, setOrganizationTypes, forceDelete);
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
  options={filterOptions} // `filterOptions` now contains the organization types
  searchPlaceholder="Search"
  onSearch={handleSearch}
  filterPlaceholder={"Filter"}
/>
        <Table
          columns={["Organization Type", "From Date", "To Date"]}
          fields={["organizationType", "fromDate", "toDate"]}
          data={organizationTypes}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          setData={setOrganizationTypes}
          handleEdit={handleEdit}
          handleView={handleView}
          handleDelete={handleDelete}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}// Pass value key
          labelKey="organizationType" //
        />
      </div>
    </div>
  );
};

export default OrganizationTypelist;