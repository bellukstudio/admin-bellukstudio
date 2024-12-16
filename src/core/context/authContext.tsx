"use client";

import {
    createContext,
    useContext,
    ReactNode,
    useMemo,
} from "react";
import { useRouter } from "next/navigation";
import useLocalStorage from "@/hooks/useLocalStorage";

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
    // Gantikan useState dengan useLocalStorage
    const [token, setToken] = useLocalStorage<string | null>("jwtToken", null);
    const router = useRouter();

    const login = (jwtToken: string) => {
        setToken(jwtToken); // Update token di localStorage
        router.push("/dashboard");
    };

    const logout = () => {
        setToken(null); // Hapus token dari localStorage
        router.push("/");
    };

    const value = useMemo(() => ({ token, login, logout }), [token]);

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
