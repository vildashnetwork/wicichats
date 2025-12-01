// import axios from 'axios';

// const axiosInstance = axios.create({
//     baseURL: import.meta.env.MODE === "development" ? 'http://localhost:4000/api' : "/api",
//     withCredentials: true,
// });

// export default axiosInstance;

// src/lib/axios.js
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "https://wicikichatbackend.onrender.com/api" : "/api",
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default axiosInstance;
