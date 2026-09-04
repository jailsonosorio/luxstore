"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
    token: string | null;
    role: string | null;
    username: string | null;
    isLoggedIn: boolean;
    isAdmin: boolean;
    loading: boolean; 
    login: (token: string, role: string, username: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    // 🔥 RECARREGAR DADOS DO LOCALSTORAGE
    useEffect(() => {
        const storedToken = localStorage.getItem("luxstore_token");
        const storedRole  = localStorage.getItem("luxstore_role");
        const storedUsername = localStorage.getItem("luxstore_username");

        if (storedToken) {
            setToken(storedToken);
            setRole(storedRole);
            setUsername(storedUsername);
            setIsLoggedIn(true);
            setIsAdmin(role === "ADMIN");
        }

        setLoading(false); 
    }, []);

    function login(token: string, role: string, username: string) {
        localStorage.setItem("luxstore_token", token);
        localStorage.setItem("luxstore_role", role);
        localStorage.setItem("luxstore_username", username);

        setToken(token);
        setRole(role);
        setUsername(username);
        setIsLoggedIn(true);
        setIsAdmin(role === "ADMIN");
    }

    function logout() {
        localStorage.removeItem("luxstore_token");
        localStorage.removeItem("luxstore_role");
        localStorage.removeItem("luxstore_username");

        setToken(null);
        setRole(null);
        setUsername(null);
        setIsLoggedIn(false);
        setIsAdmin(false);
    }

    return (
        <AuthContext.Provider
            value={{
                token,
                role,
                username,
                isLoggedIn,
                isAdmin,
                loading,
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