import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "@/services/api/customer/auth.service";
import Footer from "@/components/common/Footer";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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
      navigate("/auth/login/customer");
    } catch (error: any) {
      alert(
        error.response?.data?.message || "Token không hợp lệ hoặc đã hết hạn"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-700 text-white">
        Link không hợp lệ!
      </div>
    );
  }

  return (
    <div className="bg-neutral-700">
      <ScrollToTop />

      <section className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#151517] bg-opacity-90 p-8 rounded-2xl shadow-2xl border border-gray-800 text-white">
          <h2 className="text-2xl font-bold text-red-500 text-center mb-2">
            Đặt lại mật khẩu
          </h2>
          <p className="text-sm text-gray-400 text-center mb-6">
            Vui lòng nhập mật khẩu mới cho tài khoản của bạn
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Password */}
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder=" "
                {...register("password")}
                className={`peer w-full px-4 pt-5 pb-2 bg-transparent rounded-lg border
                  ${errors.password ? "border-red-500" : "border-gray-600"}
                  outline-none`}
              />
              <label
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-all
                  peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base
                  peer-focus:top-2 peer-focus:text-xs
                  peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs"
              >
                Mật khẩu mới
              </label>
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type="password"
                placeholder=" "
                {...register("confirmPassword")}
                className={`peer w-full px-4 pt-5 pb-2 bg-transparent rounded-lg border
                  ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-600"
                  }
                  outline-none`}
              />
              <label
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-all
                  peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base
                  peer-focus:top-2 peer-focus:text-xs
                  peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs"
              >
                Nhập lại mật khẩu
              </label>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900
                py-3 rounded-lg font-bold transition disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-2">
                {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                <span>{loading ? "Đang xử lý..." : "XÁC NHẬN"}</span>
              </div>
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
