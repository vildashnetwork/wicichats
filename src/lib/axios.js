// import axios from 'axios';

// const axiosInstance = axios.create({
//     baseURL: import.meta.env.MODE === "development" ? 'http://localhost:4000/api' : "/api",
//     withCredentials: true,
// });

// export default axiosInstance;

// src / lib / axios.js
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



// import axios from "axios";

// const BASE_URL =
//     import.meta.env.MODE === "development"
//         ? "http://localhost:4000/api" // your local backend
//         : "https://wicikichatbackend.onrender.com/api"; // your deployed backend

// const axiosInstance = axios.create({
//     baseURL: BASE_URL,
// });

// axiosInstance.interceptors.request.use((config) => {
//     const token = localStorage.getItem("token");
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
// });

// export default axiosInstance;
