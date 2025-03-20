import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../../common/Header";
import Pagetitle from "../../common/pagetitle";
import Table from "../../common/UserTable";
import api from "../../utils/api";
import Cookies from "js-cookie";
import { deleteItem } from "../../utils/delteEntity";

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filter, setFilter] = useState("");
  const [servicesFilteroptions, setServicesFilteroptions] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrgType, setSelectedOrgType] = useState(null);
  const [orgTypeOptions, setOrgTypeOptions] = useState([]);
  const [organizationType_id, setOrganizationType_id] = useState(null);
  const itemsPerPage = 10;

  // ✅ Fetch services from API (updates services list automatically)
  const fetchServices = async () => {
    const token = Cookies.get("token");
    try {
      const response = await api.get("admin/allservices", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          filter: filter === "all" ? "" : filter,
          search: searchQuery,
          page,
          limit: itemsPerPage,
        },
      });

      setServices(response.data.services);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };



    // // Handle edit
    // const handleEdit = (id) => {
    //   navigate("/createservice", { state: { id, mode: "edit" } });
    // };
  
    // // Handle view
    // const handleView = (id) => {
    //   navigate("/createservice", { state: { id, mode: "view" } });
    // };
  
    // // Handle delete confirmation
    // const handleDelete = (id, forceDelete = false, deletedType = "Service") => {
    //   deleteItem("admin/deleteservice", id, setServices, forceDelete, deletedType)
    // };



  useEffect(() => {
    fetchServices();
  }, [filter, searchQuery, page]);

  // ✅ Handle Assign Service to Organization Type
  const handleAssignService = async () => {
    if (!selectedOrgType) {
      Swal.fire("Error", "Please select an organization type.", "error");
      return;
    }

    if (selectedItems.length === 0) {
      Swal.fire("Error", "Please select at least one service.", "error");
      return;
    }

    const organizationTypee = orgTypeOptions.find((item) => item.value === selectedOrgType);

    Swal.fire({
      title: "Are you sure?",
      text: `Assign selected services to ${organizationTypee?.label}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Assign",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = Cookies.get("token");

        try {
          await api.post(
            "/admin/assign-service",
            {
              organizationType_id: selectedOrgType, // ✅ Using selectedOrgType directly
              service_id: selectedItems,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          Swal.fire("Success", "Services assigned successfully!", "success");

          // ✅ Fetch updated services after assignment
          fetchServices(); // Call function to reload the list
        } catch (error) {
          console.error("Error assigning services:", error);
          Swal.fire({
            text: error.response?.data?.message || "An error occurred.",
            icon: "error",
          });
        }

        setSelectedItems([]);
      }
    });
  };

  // ✅ Fetch Organization Types
  useEffect(() => {
    const fetchOrganizationTypes = async () => {
      const token = Cookies.get("token");
      try {
        const response = await api.get("organization/getall", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && Array.isArray(response.data.results)) {
          setOrgTypeOptions(
            response.data.results.map((org) => ({
              value: org.id,
              label: org.organizationType,
            }))
          );
        } else {
          setOrgTypeOptions([]);
        }
      } catch (error) {
        console.error("Error fetching organization types:", error);
        setOrgTypeOptions([]);
      }
    };

    fetchOrganizationTypes();
  }, []);

  // ✅ Fetch Service Filter Options
  useEffect(() => {
    const fetchServiceFilterOptions = async () => {
      const token = Cookies.get("token");
      try {
        const response = await api.get("admin/allservices", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && Array.isArray(response.data.services)) {
          setServicesFilteroptions(
            response.data.services.map((service) => ({
              value: service.id,
              label: service.servicename,
              organizationType: service.organizationType,
            }))
          );
        } else {
          setServicesFilteroptions([]);
        }
      } catch (error) {
        console.error("Error fetching service filter options:", error);
        setServicesFilteroptions([]);
      }
    };

    fetchServiceFilterOptions();
  }, []);

  return (
    <div className="bg-gray-100 h-full">
      <Header name={"Services"} />
      <Pagetitle
        title="Services List"
        buttonLabel="Create Service"
        onButtonClick={() => navigate("/createservice")}
        filterValue={filter}
        onFilterChange={(value) => {
          setFilter(value);
          setPage(1);
        }}
        options={servicesFilteroptions}
        searchPlaceholder="Search"
        onSearch={(e) => {
          setSearchQuery(e.target.value);
          setPage(1);
        }}
        filterPlaceholder="Filter"
        showRoleAssign={true}
        roleValue={selectedOrgType}
        organizationChange={setSelectedOrgType}
        organizationOptions={orgTypeOptions}
        organizationType_id={organizationType_id}
        setOrganizationType_id={setOrganizationType_id}
        assignButtonLabel="Assign"
        onAssignClick={handleAssignService} // ✅ Assign Button Click
      />

      <div className="overflow-x-auto sm:overflow-x-visible">
        <Table
          columns={["Service Name", "Organization Type", "From Date", "To Date"]}
          fields={["servicename", "organizationType", "fromdate", "todate"]}
          data={services}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          handleEdit={(id) => navigate("/createservice", { state: { id, mode: "edit" } })}
          handleView={(id) => navigate("/createservice", { state: { id, mode: "view" } })}
          handleDelete={(id) => deleteItem("admin/deleteservice", id, setServices, false, "Service")}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}
        />
      </div>
    </div>
  );
};

export default Services;
