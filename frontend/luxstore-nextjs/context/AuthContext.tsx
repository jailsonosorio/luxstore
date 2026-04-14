"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
    token: string | null;
    role: string | null;
    isLoggedIn: boolean;
    isAdmin: boolean;
    login: (token: string, role: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedRole = localStorage.getItem("role");

        setToken(storedToken);
        setRole(storedRole);
    }, []);

    function login(newToken: string, newRole: string) {
        localStorage.setItem("token", newToken);
        localStorage.setItem("role", newRole);

        setToken(newToken);
        setRole(newRole);
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        setToken(null);
        setRole(null);
    }

    return (
        <AuthContext.Provider
            value={{
                token,
                role,
                isLoggedIn: !!token,
                isAdmin: role === "ADMIN",
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}