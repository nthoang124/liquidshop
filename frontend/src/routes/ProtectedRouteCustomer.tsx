import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/CustomerAuthContext";

export default function ProtectedRouteCustomer() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login/customer" replace />;
  }

  return <Outlet />;
}
