import axios from 'axios';

const rawToken = localStorage.getItem("jwtToken");

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + rawToken,
    },
});

// Request interceptor to add token and handle any request logic
axiosInstance.interceptors.request.use(
    (config) => {
        // If you want to handle the token dynamically (e.g., refresh token), you can modify the header here
        const token = localStorage.getItem("jwtToken");
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        // You can also add other request logic here if needed
        return config;
    },
    (error) => {
        // Ensure error is an instance of Error
        return Promise.reject(new Error(error.message || 'Request error'));
    }
);

// Response interceptor to handle specific status codes or errors globally
axiosInstance.interceptors.response.use(
    (response) => {
        // You can modify the response here, like logging or formatting data
        return response;
    },
    (error) => {
        // Ensure error is an instance of Error
        const customError = new Error(error.message || 'Response error');
        customError.stack = error.stack; // Preserve stack trace for debugging

        // Handle global errors, such as token expiration or unauthorized access
        if (error.response && error.response.status === 401) {
            // Handle unauthorized error, such as logging out or redirecting to login
            console.log("Unauthorized - Please log in again.");
        }

        // If needed, handle other HTTP errors globally
        return Promise.reject(customError);
    }
);

export default axiosInstance;
