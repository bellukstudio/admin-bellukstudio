"use client";

import PrivateRoute from "@/core/routes/privateRoute";
import Profile from "../profile/page";

const DashboardPage = () => {
    return (
        <PrivateRoute>
            <Profile />
        </PrivateRoute>
    );
};

export default DashboardPage;
