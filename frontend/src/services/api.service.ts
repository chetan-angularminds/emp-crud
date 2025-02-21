import axios from "axios";

const HOST_URL = "https://emp-crud-6c99.onrender.com/api/";

const api = axios.create({
  baseURL: HOST_URL,
});

export default api;

