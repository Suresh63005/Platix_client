import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 3600; 

    if (decodedToken.exp < currentTime) {
      Cookies.remove("token"); 
      return <Navigate to="/" />;
    }
  } catch (error) {
    console.error("Invalid token:", error);
    Cookies.remove("token"); 
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
