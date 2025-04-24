import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../common/Header";
import Table from "../../common/UserTable";
import api from "../../utils/api";
import Cookies from "js-cookie";
const Rolespage = () => {
  const [roles, setRoles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const rolesPerPage = 10;

  useEffect(() => {
    fetchRoles(page);
  }, [page]);

  const fetchRoles = async (page) => {
    const token = Cookies.get("token");
    try {
      const response = await api.get(`admin/viewrole?page=${page}&limit=${rolesPerPage}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const fetchedRoles = response.data.formattedRoles;
      const totalRoles = response.data.totalRoles; // Get total roles from API
  
      if (!Array.isArray(fetchedRoles)) {
        console.error("Error: Invalid roles data", fetchedRoles);
        return;
      }
  
      setRoles(
        fetchedRoles.map((role) => ({
          name: role.rolename,
          fromDate: role.fromdate,
          toDate: role.todate,
          id: role.id,
        }))
      );
  
      if (typeof totalRoles === "number" && totalRoles > 0) {
        setTotalPages(Math.ceil(totalRoles / rolesPerPage));
      } else {
        setTotalPages(1); // Default to 1 if totalRoles is missing
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <div className="userspagecontainer w-full md:pl-0 flex flex-col">
        <Header name={"Roles"} />

        <div className="usersheader flex flex-wrap justify-between items-center p-4 space-y-4 md:space-y-0">
          <div className="users-title-container font-medium text-center md:text-left">
            <h3 className="font-semibold text-[18px] md:text-[20px]">Roles List</h3>
          </div>
        </div>

        {/* Roles Table */}
        <Table
          columns={["Role Name", "From Date", "To Date"]}
          fields={["name", "fromDate", "toDate"]}
          data={roles}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          showActions={false} // Hide actions and view columns on Rolespage
          currentPage='roles'
        />
      </div>
    </div>
  );
};

export default Rolespage;
