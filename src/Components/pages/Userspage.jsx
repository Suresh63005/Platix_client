import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../common/Header";
import Table from "../../common/UserTable";
import Pagetitle from "../../common/pagetitle";


const Userspage = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [usernameFilter, setUsernameFilter] = useState(""); // Username filter state
  const [userTypeFilter, setUserTypeFilter] = useState(""); // User type filter state
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const usersPerPage = 10;
  const totalUsers = 105; // This can be fetched from an API
  const navigate = useNavigate();

  // Dummy user data (replace with actual data from your API)
  const loadUsersForPage = (page, userTypeFilter, usernameFilter, searchQuery) => {
    const start = (page - 1) * usersPerPage;
    const newUsers = Array.from({ length: usersPerPage }, (_, index) => ({
      username: `User ${start + index + 1}`,
      type: ["Owner", "Technician", "Delivery Boy", "Dentist"][index % 4],
      mobile: `1234567890`,
      startDate: new Date().toLocaleDateString(),
      id: start + index + 1,
    }));

    // Apply filters: userType, username, and searchQuery
    const filteredUsers = newUsers.filter((user) => 
      (userTypeFilter ? user.type === userTypeFilter : true) && 
      (usernameFilter ? user.username.toLowerCase().includes(usernameFilter.toLowerCase()) : true) &&
      (searchQuery ? user.username.toLowerCase().includes(searchQuery.toLowerCase()) : true)
    );

    setUsers(filteredUsers);
    setTotalPages(Math.ceil(filteredUsers.length / usersPerPage)); 
  };

  useEffect(() => {
    loadUsersForPage(page, userTypeFilter, usernameFilter, searchQuery);
  }, [page, userTypeFilter, usernameFilter, searchQuery]); // Re-fetch when any filter or page changes

  const handleCreateUserClick = () => {
    navigate("/createuser");
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value); // Update search query state
    setPage(1); // Reset to the first page when search query changes
  };

  const handleFilterChange = (event) => {
    setUserTypeFilter(event.target.value); // Update userType filter state
    setPage(1); // Reset to the first page when filter changes
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="userspagecontainer w-full md:pl-4 flex flex-col">
        <Header name={"Organization"} />

        <Pagetitle
          title={"Users list"}
          buttonLabel={"Create User"}
          onButtonClick={handleCreateUserClick}
          filterValue={userTypeFilter} // Bind filter value
          onFilterChange={handleFilterChange} // Bind filter change handler
          options={["Owner", "Technician", "Delivery Boy", "Dentist"]} // User types filter options
          searchPlaceholder="Search users..."
          onSearch={handleSearch} // Bind search handler
        />

        <Table
          columns={["Username", "Type of User", "Mobile No", "Starting Date"]}
          fields={["username", "type", "mobile", "startDate"]}
          data={users}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />
      </div>
    </div>
  );
};

export default Userspage;
