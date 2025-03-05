import Swal from "sweetalert2";
import TickSquare from "../assets/images/TickSquare.svg";
import api from "./api";

export const deleteItem = async (url, id, setData, forceDelete = false, deletedType) => {
  const confirmationText = deletedType === "Organization Type"
    ? `This ${deletedType} is associated with organizations. Are you sure you want to delete this ${deletedType}?`
    : `Are you sure you want to delete this ${deletedType}?`;

  const result = await Swal.fire({
    text: confirmationText,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
    background: "white",
    color: "black",
  });

  if (!result.isConfirmed) return;

  try {
    const response = await api.delete(`${url}/${id}`, {
      params: { forceDelete },
    });

    if (response.status === 200) {
      Swal.fire({
        text: `${deletedType} deleted successfully`,
        imageUrl: TickSquare,
        imageWidth: 50,
        imageHeight: 50,
        background: "white",
        color: "black",
        showConfirmButton: false,
        timer: 1500,
      });

      setData((prev) =>
        Array.isArray(prev) ? prev.filter((item) => item.id !== id) : prev
      );
    }
  } catch (error) {
    console.error("Error deleting item:", error);

    const errorMessage = error.response?.data?.error || "Something went wrong! Please try again.";
    Swal.fire({
      text: errorMessage,
      icon: "error",
      background: "white",
      color: "black",
    });
  }
};
