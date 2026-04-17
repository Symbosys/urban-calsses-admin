import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
    baseURL: window.location.hostname === "localhost" 
        ? "http://localhost:4000/api/v1" 
        : "https://urban-classes-backend.vercel.app/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && !error.config.url?.includes("/auth/login")) {
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);

export default api;