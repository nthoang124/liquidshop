import type { IUserLoginResponse } from "@/types/user";
import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
    user: IUserLoginResponse | null;
    login: (token: string, user: IUserLoginResponse) => void;
    logout: () => void;
    isLoading: boolean;
}

const AdminAuthContext = createContext<AuthContextType | null>(null);

export function AdminAuthProvider({children} : {children: React.ReactNode}) {
    const [user, setUser] = useState<IUserLoginResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("admin_access_token");
        const userData = localStorage.getItem("admin");

        if(token && userData) {
            setUser(JSON.parse(userData));
        }

        setIsLoading(false);
    },[])

    const login = (token: string, user: IUserLoginResponse) => {
        localStorage.setItem("admin_access_token", token);
        localStorage.setItem("admin", JSON.stringify(user));
        setUser(user);
    }

    const logout = () => {
        localStorage.removeItem("admin_access_token");
        localStorage.removeItem("admin");
        setUser(null);
    };

    return (
        <AdminAuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}