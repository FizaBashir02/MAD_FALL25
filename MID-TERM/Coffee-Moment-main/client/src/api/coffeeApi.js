import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // change if backend uses another port
});

// Get list of coffees
export const getAllCoffees = () => API.get("/coffees");
