import axios from "axios";

const API = axios.create({
  baseURL: "https://mamababybud-backend-4.onrender.com"
});

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export default API;
