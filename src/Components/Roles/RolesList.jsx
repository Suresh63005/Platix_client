import React, { useState, useEffect } from "react";
import Header from "../../common/Header";
import Table from "../../common/UserTable";

const Rolespage = () => {
  const [roles, setRoles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const rolesPerPage = 10;
  const totalRoles = 50;

  useEffect(() => {
    setTotalPages(Math.ceil(totalRoles / rolesPerPage));
  }, [totalRoles]);

  const loadRolesForPage = (page) => {
    const start = (page - 1) * rolesPerPage;
    const newRoles = Array.from({ length: rolesPerPage }, (_, index) => ({
      name: `Role ${start + index + 1}`,
      fromDate: new Date().toLocaleDateString(),
      toDate: new Date().toLocaleDateString(),
      id: start + index + 1,
    }));
    setRoles(newRoles);
  };

  useEffect(() => {
    loadRolesForPage(page);
  }, [page]);

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
  showActions={false}  // Hide actions and view columns on Rolespage
/>
      </div>
    </div>
  );
};

export default Rolespage;
