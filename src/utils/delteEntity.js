import Swal from "sweetalert2";
import TickSquare from "../assets/images/TickSquare.svg";
import api from "./api";

// ✅ Improved Delete Function
export const deleteItem = async (url, id, setData, forceDelete = false) => {
  console.log(url)
  try {
    const response = await api.delete(`${url}/${id}`, {
      params: { forceDelete },
    });

    if (response.status === 200) {
      Swal.fire({
        text: forceDelete
          ? "Item Permanently Deleted Successfully"
          : "Item Soft Deleted Successfully",
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