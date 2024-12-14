
import { apiClient, ApiResponse } from "@/core/api-config";

interface LoginResponse {
  message: string;
  token: string;
}

const authService = {
  async login(credentials: { email: string; password: string }): Promise<ApiResponse<LoginResponse>> {
    const axiosResponse = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    const responseData: ApiResponse<LoginResponse> = axiosResponse.data;
    if (responseData.data.token) {
      localStorage.setItem('token', responseData.data.token);
    }
    return responseData;
  },
};

export default authService;
