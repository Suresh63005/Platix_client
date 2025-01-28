import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../common/Header";
import Table from "../../common/UserTable";
import Pagetitle from "../../common/pagetitle";
import { usersData } from "../../Data/data"; // Import user data from the data file

const Userspage = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [usernameFilter, setUsernameFilter] = useState(""); // Username filter state
  const [userTypeFilter, setUserTypeFilter] = useState(""); // User type filter state
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const usersPerPage = 10; // Number of users per page
  const navigate = useNavigate();

  const loadUsersForPage = (page, userTypeFilter, usernameFilter, searchQuery) => {
    // Apply filters to usersData
    const filteredUsers = usersData.filter((user) =>
      (!userTypeFilter || user.type === userTypeFilter) &&
      (!usernameFilter || user.username.toLowerCase().includes(usernameFilter.toLowerCase())) &&
      (!searchQuery || user.username.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Apply pagination
    const startIndex = (page - 1) * usersPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

    setUsers(paginatedUsers);
  };

  useEffect(() => {
    loadUsersForPage(page, userTypeFilter, usernameFilter, searchQuery);
  }, [page, userTypeFilter, usernameFilter, searchQuery]);

  const handleCreateUserClick = () => {
    navigate("/createuser");
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to the first page when search query changes
  };

  const handleFilterChange = (event) => {
    setUserTypeFilter(event.target.value);
    setPage(1); // Reset to the first page when filter changes
  };

  const handleEdit = (id) => {
    navigate("/createuser", { state: { id,mode:"edit" } });
  };

  const handleview = (id) => {
    navigate("/createuser", { state: { id, mode: "view" } });
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
          options={["Owner", "Technician", "Delivery Boy", "Dentist"]}
          searchPlaceholder="Search users..."
          onSearch={handleSearch}
          filterPlaceholder={"Filter"}
        />

        <Table
          columns={["Username", "Type of User", "Mobile No", "Starting Date"]}
          fields={["firstName", "role", "phoneNumber", "startDate"]}
          data={users}
          page={page}
          totalPages={Math.ceil(
            usersData.filter((user) =>
              (!userTypeFilter || user.type === userTypeFilter) &&
              (!usernameFilter || user.username.toLowerCase().includes(usernameFilter.toLowerCase())) &&
              (!searchQuery || user.username.toLowerCase().includes(searchQuery.toLowerCase()))
            ).length / usersPerPage
          )}
          setPage={setPage}
          handleEdit={handleEdit}
          handleview={handleview}
        />
      </div>
    </div>
  );
};

export default Userspage;
