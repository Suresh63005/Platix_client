import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../common/Header";
import Table from "../../common/UserTable";
import Pagetitle from "../../common/pagetitle";
import { deleteItem } from "../../utils/delteEntity";
import api from "../../utils/api";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
const Userspage = () => {
  const location = useLocation();

  const { organization_id } = useParams();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [roles, setRoles] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [usernameFilter, setUsernameFilter] = useState(""); // Username filter state
  const [userTypeFilter, setUserTypeFilter] = useState(""); // User type filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOptions, setFilterOptions] = useState([]); // Search query state

  const usersPerPage = 10; // Number of users per page
  const navigate = useNavigate();

  // Fetch users from API
  useEffect(() => {
    const fetchUsersAndRoles = async () => {
      try {
        let response;
        // Use search query, filter, and pagination parameters
        const params = {
          page,
          limit: usersPerPage,
          search: searchQuery,  // Pass the search query to the backend
          filter: userTypeFilter === "all" ? "" : userTypeFilter,  // Pass the selected filter to the backend
        };
  
        if (organization_id) {
          // Fetch users for a specific organization
          response = await api.get(`user/getbyorganization/${organization_id}`, {
            params,
          });
        } else {
          // Fetch all users
          response = await api.get("user/all", {
            params,
          });
        }
  
        const allUsers = response.data.users;
  
        // Fetch roles from the API for filtering
        const rolesResponse = await api.get("admin/viewrole");
        const rolesData = rolesResponse.data.formattedRoles;
        setRoles(rolesData);
  
        // Map role_name to each user based on role_id
        const usersWithRoles = allUsers.map((user) => {
          const role = rolesData.find((role) => role.id === user.role_id);
          return { ...user, roleName: role ? role.rolename : "Unknown" };
        });
  
        // Set the users and pagination based on the backend response
        setUsers(usersWithRoles);
        setTotalPages(response.data.pagination.totalPages);
      } catch (error) {
        console.error("Error fetching users and roles:", error);
      }
    };
  
    fetchUsersAndRoles();
  }, [userTypeFilter, searchQuery, page]);  // Trigger fetching when filters or search query change
  
  
  useEffect(() => {
    const fetchRoles = async () => {
      const token = Cookies.get("token");

      try {
        const response = await api.get("/admin/viewrole", {
          headers: { Authorization: `Bearer ${token}` },
        });


        if (response.data.formattedRoles && Array.isArray(response.data.formattedRoles)) {
          setFilterOptions(
            response.data.formattedRoles.map((role) => ({
              value: role.id,
              label: role.rolename || "N/A",
            }))
          );
        } else {
          console.log("No roles data or invalid response format");
          setFilterOptions([]);
        }
        
      } catch (error) {
        console.error("Error fetching roles:", error);
        setFilterOptions([]); // Fallback to empty array on error
      }
    };

    fetchRoles();
  }, []);
  // Fetch users when filters or pagination change
 
  const handleCreateUserClick = () => {
    navigate(`/createuser/${organization_id}`);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to first page when search query changes
  };
  const handleFilterChange = (selectedValue) => {
    setUserTypeFilter(selectedValue);  // ✅ Directly set the value from react-select
    setPage(1);
};


  const handleEdit = (id) => {
    navigate(`/createuser/${organization_id}`, { state: { id, mode: "edit" } });
  };

  const handleView = (id) => {
    navigate(`/createuser/${organization_id}`, { state: { id, mode: "view" } });
  };
  const handleDelete = async (id, forceDelete = false) => {
    deleteItem("/user/delete", id, setUsers, forceDelete);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="userspagecontainer w-full md:pl-0 flex flex-col bg-gray-100">
        <Header name={"Organization"} />

        <Pagetitle
          title={"Users List"}
          buttonLabel={"Create User"}
          onButtonClick={handleCreateUserClick}
          filterValue={userTypeFilter}
          onFilterChange={handleFilterChange}
          options={filterOptions}
          searchPlaceholder="Search"
          onSearch={handleSearch}
          filterPlaceholder={"Filter"}
        />

        <Table
          columns={["Username", "Type of User", "Mobile No", "Starting Date"]}
          fields={["Username", "roleName", "mobileNo", "createdAt"]}
          data={users}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
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

export default Userspage;
