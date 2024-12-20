import axiosInstance from "../instance/axiosInstance";

type ApiResponse<T> = {
    meta: {
        code: number;
        status: string;
        message: string;
    };
    data: T;
};

const apiService = {
    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        const response = await axiosInstance.get<ApiResponse<T>>('/api' + endpoint);
        return response.data;
    },

    async post<T>(endpoint: string, payload: Record<string, unknown>): Promise<ApiResponse<T>> {
        const response = await axiosInstance.post<ApiResponse<T>>('/api' + endpoint, payload);
        return response.data;
    },

    async update<T>(endpoint: string, payload: Record<string, unknown>): Promise<ApiResponse<T>> {
        const response = await axiosInstance.put<ApiResponse<T>>('/api' + endpoint, payload);
        return response.data;
    },

    async remove<T>(endpoint: string): Promise<ApiResponse<T>> {
        const response = await axiosInstance.delete<ApiResponse<T>>('/api' + endpoint);
        return response.data;
    },

    async uploadFile<T>(endpoint: string, file: File | Blob, additionalData?: Record<string, string>): Promise<ApiResponse<T>> {
        const formData = new FormData();
        formData.append("file", file);

        // Append additional data if provided
        if (additionalData) {
            Object.entries(additionalData).forEach(([key, value]) => {
                formData.append(key, value);
            });
        }

        const response = await axiosInstance.put<ApiResponse<T>>('/api' + endpoint, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    }

};

export default apiService;
