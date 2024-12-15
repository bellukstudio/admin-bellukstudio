"use client";

import Loader from "@/components/common/Loader";
import { useAuth } from "@/core/context/authContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const { token } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // If no token, redirect to login
        if (!token) {
            router.push("/");
        }
    }, [token, router]);

    // If not authenticated, don't render the children
    if (!token) {
        return <Loader/>;
    }

    return <>{children}</>;
};

export default PrivateRoute;
