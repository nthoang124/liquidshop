import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "@/services/api/customer/auth.service";
import Footer from "@/components/common/Footer";
import { Eye, EyeOff } from "lucide-react";
import ScrollToTop from "@/components/common/ScrollToTop";

const schema = z
  .object({
    password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

type ResetFormValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: ResetFormValues) => {
    if (!token) return;
    setLoading(true);
    try {
      await authService.resetPassword(token, values.password);
      alert("Đặt lại mật khẩu thành công! Vui lòng đăng nhập.");
      navigate("/auth/login/customer");
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Lỗi đặt lại mật khẩu (Token có thể đã hết hạn)"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token)
    return (
      <div className="text-white text-center p-10">Link không hợp lệ!</div>
    );

  return (
    <div className="min-h-screen bg-neutral-700 flex flex-col">
      <ScrollToTop />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#151517] p-8 rounded-2xl shadow-xl text-white">
          <h2 className="text-2xl font-bold text-red-500 mb-4 text-center">
            Đặt lại mật khẩu
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Mật khẩu mới"
                {...register("password")}
                className="w-full p-3 bg-transparent border border-gray-600 rounded text-white"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-3 text-gray-400"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder="Nhập lại mật khẩu"
                {...register("confirmPassword")}
                className="w-full p-3 bg-transparent border border-gray-600 rounded text-white"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              disabled={loading}
              className="w-full bg-red-600 p-3 rounded font-bold hover:bg-red-700"
            >
              {loading ? "Đang xử lý..." : "Xác nhận"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
