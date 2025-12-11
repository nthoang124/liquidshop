import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ProtectedRouteAdmin ({ children }: Props) {
    const token = localStorage.getItem("adminToken");

    if(!token){
        return <Navigate to="/admin/login" replace />
    }

    return children;
}