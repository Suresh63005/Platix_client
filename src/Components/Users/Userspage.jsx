import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../common/Header";
import Table from "../../common/UserTable";
import Pagetitle from "../../common/pagetitle";
import { deleteItem } from "../../utils/delteEntity";
import api from "../../utils/api";

const Userspage = () => {
  const location=useLocation();
  const { organizationType_id } = location.state || {};
  // console.log(organizationType_id)
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [usernameFilter, setUsernameFilter] = useState(""); // Username filter state
  const [userTypeFilter, setUserTypeFilter] = useState(""); // User type filter state
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const usersPerPage = 10; // Number of users per page
  const navigate = useNavigate();

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await api.get("user/all");
      const allUsers = response.data.users; 

      // Apply filters
      const filteredUsers = allUsers.filter((user) =>
        (!userTypeFilter || user.type === userTypeFilter) &&
        (!usernameFilter || user.username.toLowerCase().includes(usernameFilter.toLowerCase())) &&
        (!searchQuery || user.username.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      // Pagination
      const startIndex = (page - 1) * usersPerPage;
      const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

      setUsers(paginatedUsers);
      setTotalPages(Math.ceil(filteredUsers.length / usersPerPage));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch users when filters or pagination change
  useEffect(() => {
    fetchUsers();
  }, [page, userTypeFilter, usernameFilter, searchQuery]);

  const handleCreateUserClick = () => {
    navigate("/createuser",{state:{organizationType_id}});
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to first page when search query changes
  };

  const handleFilterChange = (event) => {
    setUserTypeFilter(event.target.value);
    setPage(1); // Reset to first page when filter changes
  };

  const handleEdit = (id) => {
    navigate("/createuser", { state: { id, mode: "edit" } });
  };

  const handleView = (id) => {
    navigate("/createuser", { state: { id, mode: "view" } });
  };
  const handleDelete=async(id,forceDelete=false)=>{
    deleteItem("/user/delete", id, setUsers, forceDelete);
  }

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
          options={["Owner", "Technician", "Delivery Boy", "Dentist"]}
          searchPlaceholder="Search"
          onSearch={handleSearch}
          filterPlaceholder={"Filter"}
        />

        <Table
          columns={["Username", "Type of User", "Mobile No", "Starting Date"]}
          fields={["Username", "type", "mobileNo", "createdAt"]}
          data={users}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          handleEdit={handleEdit}
          handleView={handleView}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Userspage;
