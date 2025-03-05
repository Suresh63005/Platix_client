import Swal from "sweetalert2";
import TickSquare from "../assets/images/TickSquare.svg";
import api from "./api";

// ✅ Improved Delete Function with Confirmation
export const deleteItem = async (url, id, setData, forceDelete = false) => {
  console.log(url);

  // Show confirmation alert before deleting
  const result = await Swal.fire({
    text: "Are you sure you want to delete this item?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
    background: "white",
    color: "black",
  });

  // If user cancels, do nothing
  if (!result.isConfirmed) return;

  try {
    const response = await api.delete(`${url}/${id}`, {
      params: { forceDelete },
    });

    if (response.status === 200) {
      Swal.fire({
        text: forceDelete
          ? "Item Deleted Successfully"
          : "Item Deleted Successfully",
        imageUrl: TickSquare,
        imageWidth: 50,
        imageHeight: 50,
        background: "white",
        color: "black",
        showConfirmButton: false,
        timer: 1500,
      });

      // ✅ Ensure setData updates state correctly
      setData((prev) => (Array.isArray(prev) ? prev.filter((item) => item.id !== id) : prev));
    }
  } catch (error) {
    console.error("Error deleting item:", error);

    Swal.fire({
      text: error.response?.data?.error || "Something went wrong! Please try again.",
      icon: "error",
      background: "white",
      color: "black",
    });
  }
};
