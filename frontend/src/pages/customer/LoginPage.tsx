import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAuth } from "@/context/CustomerAuthContext";
import logo from "@/assets/icons/TL-Logo.png";
import Footer from "@/components/common/Footer";

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

const schema = z.object({
  email: z.string().email("Vui lòng nhập đúng định dạng Email"),
  password: z.string().min(1, "Mật khẩu là bắt buộc"),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth(); // TypeScript tự infer
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: { email: "", password: "", remember: false },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    setLoading(true);
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
    <div className="h-screen flex flex-col bg-neutral-700 font-sans">
      <style>{autofillFixStyle}</style>
      <main className="flex-grow flex items-center justify-center p-10">
        <div className="w-full max-w-md bg-[#151517] bg-opacity-90 p-8 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col gap-4 border border-gray-800">
          {/* Logo Section */}
          <div className="flex justify-center mb-2">
            {logo ? (
              <img src={logo} alt="Logo" className="h-20 w-20 object-contain" />
            ) : (
              <h1 className="text-3xl font-bold text-white">LOGO</h1>
            )}
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-1">
              Chào mừng trở lại
            </h2>
            <p className="text-gray-400 text-sm">
              Vui lòng nhập thông tin để đăng nhập
            </p>
          </div>

          {serverError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm text-center">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-2">
            {/* Input Email */}
            <div className="space-y-1">
              <div className="relative">
                <input
                  type="text"
                  id="email"
                  placeholder=" "
                  disabled={loading}
                  {...register("email")}
                  className={`peer w-full px-4 pt-5 pb-2 text-white bg-[#151517] rounded-lg border 
                    ${errors.email ? "border-red-500" : "border-gray-600"} 
                     outline-none transition-all`}
                />
                <label
                  htmlFor="email"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base transition-all duration-200 cursor-text
                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
                    peer-focus:top-2 peer-focus:text-xs peer-focus:text-gray-200
                    peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-200"
                >
                  Email
                </label>
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Input Password */}
            <div className="space-y-1">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder=" "
                  disabled={loading}
                  {...register("password")}
                  className={`peer w-full px-4 pt-5 pb-2 text-white bg-[#151517] rounded-lg border 
                    ${errors.password ? "border-red-500" : "border-gray-600"} 
                     outline-none transition-all`}
                />
                <label
                  htmlFor="password"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base transition-all duration-200 cursor-text
                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
                    peer-focus:top-2 peer-focus:text-xs peer-focus:text-gray-200
                    peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-200"
                >
                  Mật khẩu
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center text-sm text-gray-400">
              <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                <input
                  type="checkbox"
                  {...register("remember")}
                  className="rounded border-gray-600 bg-gray-700 text-red-600 focus:ring-red-500"
                />
                Ghi nhớ tôi
              </label>
              <Link
                to="/auth/reset-password"
                className="hover:text-red-500 transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg shadow-red-900/20 cursor-pointer"
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>

          <div className="mt-2 space-y-4">
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-gray-700"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-xs">
                HOẶC
              </span>
              <div className="flex-grow border-t border-gray-700"></div>
            </div>
            <p className="text-gray-400 text-sm text-center">
              Chưa có tài khoản?{" "}
              <Link
                to="/auth/register/customer"
                className="text-md font-bold text-red-500 hover:underline transition-all"
              >
                Đăng ký ngay
              </Link>
            </p>
            <div className="text-center">
              <Link
                to="/"
                className="text-sm text-gray-500 hover:text-white transition-colors"
              >
                ← Quay về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
