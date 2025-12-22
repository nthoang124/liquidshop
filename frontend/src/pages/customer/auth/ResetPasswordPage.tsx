import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

import { authService } from "@/services/api/customer/auth.service";
import logo from "@/assets/icons/TL-Logo.png";
import loginBg from "@/assets/images/auth-bg.jpg";
import Footer from "@/components/common/Footer";
import ScrollToTop from "@/components/common/ScrollToTop";
import useDocumentTitle from "@/hooks/useDocumentTitle";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Mật khẩu tối thiểu 8 ký tự")
      .regex(/[A-Z]/, "Cần ít nhất 1 chữ hoa")
      .regex(/[a-z]/, "Cần ít nhất 1 chữ thường")
      .regex(/[0-9]/, "Cần ít nhất 1 số"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type ResetFormValues = z.infer<typeof schema>;

const autofillFixStyle = `
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 1000px #151517 inset !important;
    -webkit-text-fill-color: #ffffff !important;
    transition: background-color 5000s ease-in-out 0s;
  }
`;

export default function ResetPasswordPage() {
  useDocumentTitle("Đặt lại mật khẩu");
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: ResetFormValues) => {
    if (!token) return;
    setLoading(true);
    setServerError(null);
    try {
      await authService.resetPassword(token, values.password);
      setIsSuccess(true);
      setTimeout(() => navigate("/auth/login/customer"), 3000);
    } catch (error: any) {
      setServerError(
        error.response?.data?.message ||
          "Liên kết đã hết hạn hoặc không hợp lệ."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="min-h-screen flex flex-col bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${loginBg})` }}
      >
        <style>{autofillFixStyle}</style>
        <ScrollToTop />

        <div className="flex-1 w-full bg-black/60 flex flex-col">
          <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10">
            <div className="w-full max-w-[440px] bg-[#151517]/95 p-6 sm:p-8 md:p-10 rounded-sm shadow-2xl backdrop-blur-md flex flex-col gap-6 border border-gray-800">
              {/* Logo Section */}
              <div className="flex justify-center">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
                />
              </div>

              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 uppercase tracking-tight">
                  Đặt lại mật khẩu
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Vui lòng nhập mật khẩu mới cho tài khoản của bạn
                </p>
              </div>

              {isSuccess ? (
                <div className="p-6 rounded bg-green-500/10 border border-green-500/50 text-green-500 text-center animate-in fade-in zoom-in-95">
                  <CheckCircle2 className="mx-auto mb-3 h-10 w-10" />
                  <p className="font-bold mb-1">Thành công!</p>
                  <p className="text-sm">
                    Mật khẩu đã được thay đổi. Đang chuyển hướng...
                  </p>
                </div>
              ) : (
                <>
                  {serverError && (
                    <div className="p-3 rounded bg-red-500/10 border border-red-500/50 text-red-500 text-xs sm:text-sm text-center">
                      {serverError}
                    </div>
                  )}

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-5"
                    >
                      {/* New Password */}
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="relative space-y-0">
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPass ? "text" : "password"}
                                  placeholder=" "
                                  disabled={loading}
                                  {...field}
                                  className="peer w-full px-4 pt-6 pb-2 text-white bg-transparent rounded border-gray-600 focus:border-red-500 h-auto outline-none transition-all"
                                />
                                <label
                                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base transition-all duration-200 cursor-text pointer-events-none 
                                  peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-gray-200 
                                  peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-200"
                                >
                                  Mật khẩu mới
                                </label>
                                <button
                                  type="button"
                                  onClick={() => setShowPass(!showPass)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                                >
                                  {showPass ? (
                                    <EyeOff size={18} />
                                  ) : (
                                    <Eye size={18} />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-500 text-[10px] sm:text-xs ml-1 mt-1" />
                          </FormItem>
                        )}
                      />

                      {/* Confirm Password */}
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem className="relative space-y-0">
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="password"
                                  placeholder=" "
                                  disabled={loading}
                                  {...field}
                                  className="peer w-full px-4 pt-6 pb-2 text-white bg-transparent rounded border-gray-600 focus:border-red-500 h-auto outline-none transition-all"
                                />
                                <label
                                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base transition-all duration-200 cursor-text pointer-events-none 
                                  peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-gray-200 
                                  peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-200"
                                >
                                  Xác nhận mật khẩu
                                </label>
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-500 text-[10px] sm:text-xs ml-1 mt-1" />
                          </FormItem>
                        )}
                      />

                      <p className="text-gray-400 text-xs">
                        <span className="italic text-red-500">*Lưu ý:</span> Mật
                        khẩu phải chứa ít nhất 8 kí tự, bao gồm ít nhất 1 kí tự
                        hoa, thường và số.
                      </p>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-bold py-6 rounded transition-all duration-200 shadow-lg shadow-red-900/20 active:scale-[0.98]"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ĐANG XỬ LÝ...
                          </>
                        ) : (
                          "XÁC NHẬN THAY ĐỔI"
                        )}
                      </Button>
                    </form>
                  </Form>
                </>
              )}

              <div className="text-center pt-2">
                <Link
                  to="/auth/login/customer"
                  className="text-xs sm:text-sm text-gray-500 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>←</span> Quay lại đăng nhập
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
