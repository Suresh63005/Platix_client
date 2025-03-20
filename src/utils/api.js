import axios from "axios";
import Cookies from "js-cookie"; 

const api = axios.create({
  baseURL: "http://localhost:5001",
  // baseURL: "https://platix-server.vercel.app/",
  withCredentials: true, 
});


api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("user"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
