import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
    id: string,
    email: string,
    fullName: string,
    role: string,
}

interface AuthContextType {
    user: User | null,
    login: (token: string, user: User) => void,
    logout: () => void,
}

const AdminAuthContext = createContext<AuthContextType | null>(null);

export function AdminAuthProvider({children} : {children: React.ReactNode}) {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        const userData = localStorage.getItem("user");

        if(!token || !userData) return;

         const payload = JSON.parse(atob(token.split(".")[1]));
        if (Date.now() >= payload.exp * 1000) {
            return logout();
        }

        setUser(JSON.parse(userData));
    },[])

    const login = (token: string, user: User) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        navigate("/admin");
    }

    const logout = () => {
        localStorage.removeItem("tokenAdmin");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/admin/login");
    };

    return (
        <AdminAuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}