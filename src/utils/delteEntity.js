import axios from "axios";
import Swal from "sweetalert2";
import TickSquare from "../assets/images/TickSquare.svg";

export const deleteItem = async (url, id, setData, forceDelete = false) => {
  try {
    const response = await axios.delete(`${url}/${id}`, {
      params: { forceDelete: forceDelete.toString() },
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

      setData((prev) => prev.filter((item) => item.id !== id));
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
