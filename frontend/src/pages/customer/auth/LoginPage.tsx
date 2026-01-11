import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAuth } from "@/context/CustomerAuthContext";
import logo from "@/assets/icons/TL-Logo.png";
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

const schema = z.object({
  email: z.string().email("Email là bắt buộc"),
  password: z.string().min(1, "Mật khẩu là bắt buộc"),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof schema>;

export default function LoginPage() {
  useDocumentTitle("Tài khoản");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: false },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    setLoading(true);
    setServerError(null);
    try {
      const result = await login({
        email: values.email,
        password: values.password,
        remember: values.remember,
      });

      if (result.success) {
        navigate("/");
      } else {
        setServerError(result.message || "Email hoặc mật khẩu không chính xác");
      }
    } catch (error) {
      setServerError("Lỗi hệ thống, vui lòng thử lại sau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] bg-[#151517]/95 p-6 sm:p-8 md:p-10 rounded-sm shadow-2xl backdrop-blur-md flex flex-col gap-6 border border-gray-800 animate-in fade-in zoom-in-95 duration-300">
      {/* Logo Section */}
      <div className="flex justify-center">
        {logo ? (
          <img
            src={logo}
            alt="Logo"
            className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
          />
        ) : (
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tighter">
            LIQUID
          </h1>
        )}
      </div>

      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 uppercase tracking-tight">
          Chào mừng trở lại
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm">
          Vui lòng nhập thông tin để đăng nhập
        </p>
      </div>

      {serverError && (
        <div className="p-3 rounded bg-red-500/10 border border-red-500/50 text-red-500 text-xs sm:text-sm text-center animate-in fade-in zoom-in-95">
          {serverError}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Input Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="relative space-y-0">
                <FormControl>
                  <div className="relative">
                    <Input
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
                      Email
                    </label>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 text-sm sm:text-sm ml-1 mt-1" />
              </FormItem>
            )}
          />

          {/* Input Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="relative space-y-0">
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
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
                      Mật khẩu
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 text-sm sm:text-sm ml-1 mt-1" />
              </FormItem>
            )}
          />

          <div className="flex justify-between items-center text-[11px] sm:text-sm text-gray-400">
            <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
              <input
                type="checkbox"
                {...form.register("remember")}
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-red-600 focus:ring-red-500 accent-red-600"
              />
              Ghi nhớ tôi
            </label>
            <Link
              to="/auth/reset-password"
              className="hover:text-red-500 transition-colors font-medium"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-bold py-6 rounded transition-all duration-200 shadow-lg shadow-red-900/20 active:scale-[0.98]"
          >
            {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
          </Button>
        </form>
      </Form>

      <div className="space-y-3">
        <div className="relative flex items-center">
          <div className="flex-grow border-t border-gray-800"></div>
          <span className="flex-shrink mx-4 text-gray-600 text-xs font-bold uppercase tracking-widest">
            Hoặc
          </span>
          <div className="flex-grow border-t border-gray-800"></div>
        </div>

        <p className="text-gray-400 text-xs sm:text-sm text-center">
          Chưa có tài khoản?{" "}
          <Link
            to="/auth/register/customer"
            className="font-bold text-red-500 hover:text-red-400 hover:underline transition-all ml-1"
          >
            Đăng ký ngay
          </Link>
        </p>

        <div className="text-center">
          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-white transition-colors inline-flex items-center gap-1"
          >
            <span>←</span> Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
