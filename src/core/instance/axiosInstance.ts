import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        // Jangan set Authorization di sini, karena akan crash di server-side
    },
});

// ✅ Request interceptor — hanya dijalankan di client
axiosInstance.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem("jwtToken");
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(new Error(error.message || 'Request error'));
    }
);

// ✅ Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const customError = new Error(error.message || 'Response error');
        customError.stack = error.stack;

        if (error.response && error.response.status === 401) {
            console.log("Unauthorized - Please log in again.");
        }

        return Promise.reject(customError);
    }
);

export default axiosInstance;
