import { useAuth } from "../context/authContext";
import { useRouter } from "next/router";
import { useEffect, ComponentType } from "react";

// Define a type for the HOC props
type WithAuthProps = { [key: string]: any };

const withAuth = <P extends WithAuthProps>(WrappedComponent: ComponentType<P>) => {
    const WithAuthComponent = (props: P) => {
        const { token } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!token) {
                router.replace("/");
            }
        }, [token]);

        if (!token) return null; // Render nothing if not logged in

        // Render the wrapped component with all its props
        return <WrappedComponent {...props} />;
    };

    return WithAuthComponent;
};

export default withAuth;
