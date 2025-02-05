import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../common/Header";
import Pagetitle from "../../common/pagetitle";
import Table from "../../common/UserTable";
import Swal from "sweetalert2";

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteServiceId, setDeleteServiceId] = useState(null);
  const itemsPerPage = 10;


  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/allservices", {
          params: {
            filter: selectedFilter,
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
  }, [selectedFilter, searchQuery, page]);

  const handleEdit = (id) => {
    navigate("/createservice", { state: { id, mode: "edit" } });
  };

  const handleView = (id) => {
    navigate("/createservice", { state: { id, mode: "view" } });
  };
  const handleDelete = (serviceId) => {
    console.log("Deleting service with ID:", serviceId); // Log the serviceId to verify it's correct

    if (!serviceId) {
      Swal.fire("Error", "Service ID is missing!", "error");
      return;
    }

    // Show confirmation dialog
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
        // Set the service ID to trigger deletion via useEffect
        setDeleteServiceId(serviceId);
      }
    });
  };

  // UseEffect to perform the deletion when deleteServiceId is set
  useEffect(() => {
    if (deleteServiceId) {
      // Make an API call to delete the service from the backend
      axios
        .delete(`http://localhost:5000/admin/deleteservice/${deleteServiceId}`)
        .then((response) => {
          // Handle successful deletion here
          Swal.fire("Deleted!", "Your service has been deleted.", "success");
          // Remove deleted service from the UI
          setServices(services.filter((service) => service.id !== deleteServiceId));
          setDeleteServiceId(null); // Reset state after deletion
        })
        .catch((error) => {
          Swal.fire("Error!", "There was an issue deleting the service.", "error");
          console.error("Error deleting service:", error);
          setDeleteServiceId(null); // Reset state on error
        });
    }
  }, [deleteServiceId, services]);

  
  
  return (
    <div className="bg-gray-100 h-full">
      <Header name={"Services"} />
      <Pagetitle
        title="Services List"
        buttonLabel="Create Service"
        onButtonClick={() => navigate("/createservice")}
        filterValue={selectedFilter}
        onFilterChange={(value) => {
          setSelectedFilter(value);
          setPage(1);
        }}
        options={[...new Set(services.map((service) => service.servicename))]}
        searchPlaceholder="Search"
        onSearch={(e) => {
          setSearchQuery(e.target.value);
          setPage(1);
        }}
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
          handleview={handleView}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Services;
