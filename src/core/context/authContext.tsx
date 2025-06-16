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
    const router = useRouter();

    // Load token on client-side only
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedToken = localStorage.getItem("jwtToken");
            if (storedToken) {
                setToken(storedToken);
            }
        }
    }, []);

    const login = (jwtToken: string) => {
        setToken(jwtToken);
        if (typeof window !== "undefined") {
            localStorage.setItem("jwtToken", jwtToken);
        }
        router.push("/dashboard");
    };

    const logout = () => {
        setToken(null);
        if (typeof window !== "undefined") {
            localStorage.removeItem("jwtToken");
        }
        router.push("/");
    };

    const value = useMemo(() => ({ token, login, logout }), [token]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
