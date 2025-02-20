import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../../common/Header";
import Pagetitle from "../../common/pagetitle";
import Table from "../../common/UserTable";
import api from "../../utils/api";
import Cookies from "js-cookie";

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filter,setFilter] = useState("")
 const [servicesFilteroptions,setServicesFilteroptions] = useState()
  const [selectedFilter, setSelectedFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteServiceId, setDeleteServiceId] = useState(null);
  const [selectedOrgType, setSelectedOrgType] = useState(null);
  console.log(selectedOrgType,"selected organization")
  const [orgTypeOptions, setOrgTypeOptions] = useState([]);; 
  console.log(orgTypeOptions, "from orgggggggggggggggggg")
  const [organizationType_id,setOrganizationType_id] = useState(null);
  
  const itemsPerPage = 10;

  // Fetch services from API
  useEffect(() => {
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

    fetchServices();
  }, [filter, searchQuery, page]);

  // Handle edit
  const handleEdit = (id) => {
    navigate("/createservice", { state: { id, mode: "edit" } });
  };

  // Handle view
  const handleView = (id) => {
    navigate("/createservice", { state: { id, mode: "view" } });
  };

  // Handle delete confirmation
  const handleDelete = (serviceId) => {
    if (!serviceId) {
      Swal.fire("Error", "Service ID is missing!", "error");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setDeleteServiceId(serviceId);
      }
    });
  };

  // Perform delete when deleteServiceId is set
  useEffect(() => {
    const token = Cookies.get("token");
    if (deleteServiceId) {
      api
      .delete(`admin/deleteservice/${deleteServiceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(() => {
          Swal.fire("Deleted!", "Service has been deleted.", "success");
          setServices(services.filter((service) => service.id !== deleteServiceId));
          setDeleteServiceId(null);
        })
        .catch((error) => {
          Swal.fire("Error!", "There was an issue deleting the service.", "error");
          console.error("Error deleting service:", error);
          setDeleteServiceId(null);
        });
    }
  }, [deleteServiceId, services]);

  // Fetch organization types for the dropdown
  useEffect(() => {
    const fetchOrganizationTypes = async () => {
      const token = Cookies.get("token");
      try {
        const response = await api.get("organization/getall", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Organization Types Response:", response);
        if (response.data && Array.isArray(response.data.results)) {
          setOrgTypeOptions(response.data.results.map(org => ({
            value: org.id, // Use org.id for value
            label: org.organizationType, // Use org.name for label
          })));
        } else {
          setOrgTypeOptions([]); // Ensure it's always an array
        }
      } catch (error) {
        console.error("Error fetching organization types:", error);
        setOrgTypeOptions([]); // Fallback to empty array on error
      }
    };
    fetchOrganizationTypes();
  }, []);

  useEffect(() => {
    const fetchServiceFilterOptions = async () => {
      const token = Cookies.get("token");
      try {
        const response = await api.get("admin/allservices", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log("Services Filter Response:", response);
        
        if (response.data && Array.isArray(response.data.services)) {
          setServicesFilteroptions(
            response.data.services.map(service => ({
              value: service.id, // Service ID for filtering
              label: service.servicename, // Displayed service name
            }))
          );
        } else {
          setServicesFilteroptions([]); // Ensure fallback is an empty array
        }
      } catch (error) {
        console.error("Error fetching service filter options:", error);
        setServicesFilteroptions([]); // Fallback to an empty array on error
      }
    };
  
    fetchServiceFilterOptions();
  }, []);
  // Handle service assignment to organization type
  const handleAssignService = () => {
    if (!selectedOrgType) {
      Swal.fire("Error", "Please select an organization type.", "error");
      return;
    }

    if (services.length === 0) {
      Swal.fire("Error", "Please select at least one service.", "error");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: `Assign selected services to organization type ${selectedOrgType}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Assign",
    }).then((result) => {
      const token = Cookies.get("token");
      if (result.isConfirmed) {
        api
          .post("/admin/assign-service", {
            organizationType_id: organizationType_id,
    service_id: selectedItems
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            Swal.fire("Success", "Services assigned successfully!", "success");
          })
          .catch((error) => {
            console.error("Error assigning services:", error);
            Swal.fire("Error", "Failed to assign services.", "error");
          });
      }
    });
  };
  // const handleFilterChange = (value) => {
  //   setFilter(value);
  //   setPage(1);
  // };

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
        showRoleAssign={true} // Enable organization type assignment
        roleValue={selectedOrgType} // Using org type instead of role
        organizationChange={setSelectedOrgType} // Updating selected organization type
        organizationOptions={orgTypeOptions}
        organizationType_id={organizationType_id}
        setOrganizationType_id={setOrganizationType_id}
        assignButtonLabel="Assign"
        onAssignClick={handleAssignService} // Updated function call
      />

      <div className="overflow-x-auto sm:overflow-x-visible">
        <Table
          columns={["Service Name", "From Date", "To Date"]}
          fields={["servicename", "fromdate", "todate"]}
          data={services}
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

export default Services;
