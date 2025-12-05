import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor (Attach token)
// axiosClient.interceptors.request.use((config: AxiosRequestConfig) => {
//   const token = localStorage.getItem("token");

//   if (token && config.headers) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// ⭐ Response Interceptor (Handle response & errors)
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
);

export default axiosClient;
