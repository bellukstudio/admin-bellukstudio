"use client"
import { useAuth } from "@/core/context/authContext";
import withAuth from "@/core/middleware/withAuth";
import PrivateRoute from "@/core/routes/privateRoute";
import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router

const DashboardPage = () => {
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout(); // Remove token from context and storage
        router.push("/"); // Redirect to login page after logout
    };

    return (
        <PrivateRoute>
            <h1>Welcome to the Dashboard</h1>
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white py-2 px-4 rounded"
            >
                Logout
            </button>
        </PrivateRoute>
    );
};

export default withAuth(DashboardPage);
