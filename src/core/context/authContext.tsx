"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useMemo,
} from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [token, setToken] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false); // Ensure consistent hydration
    const router = useRouter();

    useEffect(() => {
        setIsClient(true); // Set to true once the client mounts
        const storedToken = localStorage.getItem("jwtToken");
        if (storedToken) setToken(storedToken);
    }, [token]);

    const login = (jwtToken: string) => {
        setToken(jwtToken);
        localStorage.setItem("jwtToken", jwtToken);
        router.push("/dashboard");
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem("jwtToken");
        router.push("/");
    };

    const value = useMemo(() => ({ token, login, logout }), [token]);

    if (!isClient) {
        return null; // Avoid rendering until the client has mounted
    }

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
