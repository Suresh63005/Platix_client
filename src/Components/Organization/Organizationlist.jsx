import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../common/Header";
import Table from "../../common/UserTable";
import Pagetitle from "../../common/pagetitle";
import UserICon from "../../assets/images/Users icon.svg";
import { organizationsData } from "../../Data/data";
import { Class, Label } from "@mui/icons-material";
import { ClassNames } from "@emotion/react";
import axios from "axios";
import api from "../../utils/api";
import { deleteItem } from "../../utils/delteEntity";
import Cookies from "js-cookie";

const OrganizationList = () => {
  const [organizations, setOrganizations] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const orgsPerPage = 10;
  const navigate = useNavigate();

  const [filterOptions,setFilterOptions] = useState([])

  const loadOrganizationsForPage = (page, filter, searchQuery) => {
    const apiUrl = "api/organization/all";
  
    api.get(apiUrl, {
      params: {
        page,
        limit: orgsPerPage,
        filter,
        search: searchQuery,
      },
    })
    .then((response) => {
      console.log("API Response in Frontend:", response.data); // ✅ Log response
  
      const { data } = response;
      const filteredOrgs = data.data || []; 
  
      console.log("Processed Organizations Data:", filteredOrgs); // ✅ Log data after processing
  
      setOrganizations(filteredOrgs);
      setTotalPages(Math.ceil(data.pagination.total / orgsPerPage)); 
    })
    .catch((error) => {
      console.error("API Fetch Error:", error);
      setOrganizations([]); 
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
              value: org.id, // Use organizationType as value
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
    loadOrganizationsForPage(page, filter, searchQuery);
  }, [page, filter, searchQuery]);

  const handleIconClick = (organization_id) => {
    navigate(`/userspage/${organization_id}`);
  };

  const renderUserIcon = (organization_id) => (
    <div
      className="flex items-center justify-center py-2 px-7 rounded-[10px] cursor-pointer"
      style={{ backgroundColor: "#660F5D1A" }}
      onClick={()=>{handleIconClick(organization_id)}}
    >
      <img src={UserICon} alt="User Icon" className="w-5 h-5" />
    </div>
  );

  const handleFilterChange = (value) => {
    setFilter(value);
    setPage(1);
  };

  const handleSearch = (event) => {
    console.log(typeof event.target.value)
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handleCreateOrganization = () => {
    navigate("/createorganization");
  };

  const handleEdit = (id) => {
    navigate("/createorganization", { state: { id, mode: "edit" } });
  };

  const handleView = (id) => {
    navigate("/createorganization", { state: { id, mode: "view" } });
  };
  const handleDelete = (id,forceDelete=false) => {
    deleteItem("api/organization/delete",id,setOrganizations,forceDelete)
  };


  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="organization-list-container bg-gray-100 w-full md:pl-0 flex flex-col">
        <Header name={"Organization"} />

        <Pagetitle
          title="Organization List"
          buttonLabel="Create Organization"
          onButtonClick={handleCreateOrganization}
          filterValue={filter}
          onFilterChange={handleFilterChange}
          options={filterOptions}
          searchPlaceholder="Search "
          onSearch={handleSearch}
          filterPlaceholder="Filter"
        />
        <Table
          columns={[
            "Organization Name",
            "Organization Type",
            "Mobile No",
            { label: "Users", style: { textAlign: "center" } }, 
          ]}
          fields={["name", "organizationType", "mobile", "icon"]}
          data={organizations.map((org) => ({
            ...org,
            organizationType: org.organizationType?.organizationType || "N/A", 
            icon: renderUserIcon(org.id),
          }))} 
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          setData={setOrganizations}
          handleEdit={handleEdit}
          handleView={handleView}
          handleDelete={handleDelete}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}
        />
      </div>
    </div>
  );
};

export default OrganizationList;
