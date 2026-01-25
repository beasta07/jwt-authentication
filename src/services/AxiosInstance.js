import axios from "axios";

export const AxiosInstance = axios.create({
  baseURL: "https://api.freeapi.app/api/v1/",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
  },
});

// Request interceptor to add access token
AxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      AxiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 error and not already retried
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Request new token
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await axios.post(
          "https://api.freeapi.app/api/v1/users/refresh-token",
          { refreshToken }
        );

        const { accessToken } = res.data.data;
        localStorage.setItem("accessToken", accessToken);
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        return AxiosInstance(originalRequest);
      } catch (error) {
        // Clear tokens on failure
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);