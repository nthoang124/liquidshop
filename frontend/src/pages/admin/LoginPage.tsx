import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import authApi from "@/services/api/admin/authApi";
import type { AxiosError } from "axios";
import logoShop from "@/assets/icons/TL-Logo.png"
import { useAuth } from "@/context/AdminAuthContext";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      // Gọi API login admin
      const res = await authApi.login(email, password);

      const data = res.data;

      const isSuccess = res.status === 200;

      if (!isSuccess) {
        setErrorMessage(data.message || "Đăng nhập thất bại");
        setLoading(false);
        return;
      }

      // Lưu token vào localStorage
      login(res.data.token, res.data.user);

      navigate("/admin", { replace: true }); 
    } catch (err: unknown) {
        const error = err as AxiosError<{messaage: string}>
        const errorMessage = error.message;
        setErrorMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="w-full min-h-screen bg-center flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-200 p-4"
      >
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        className="w-full min-h-screen flex items-center justify-center"
      >
      <Card className="w-full max-w-110 shadow-md border border-gray-200">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-center">
            <img src={logoShop} alt="logoshop" className="w-30 h-28"/>
          </div>
          <CardTitle className="text-2xl md:text-3xl font-bold">Welcome back</CardTitle>
          <CardDescription className="text-sm md:text-base">Đăng nhập để quản lý hệ thống</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* EMAIL */}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input 
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <Label>Mật khẩu</Label>
            <Input 
              type="password"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* ERROR MESSAGE */}
          {errorMessage && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* LOGIN BUTTON */}
          <Button
            type="submit"
            className="w-full h-11 text-md font-semibold"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Đăng nhập"
            )}
          </Button>
        </CardContent>
      </Card>
      </form>
    </div>
  );
}
