import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle } from "lucide-react"; // 1. Import CheckCircle
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/CustomerAuthContext";
import logo from "@/assets/icons/TL-Logo.png";
import Footer from "@/components/common/Footer";
import ScrollToTop from "@/components/common/ScrollToTop";

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

const schema = z
  .object({
    fullName: z
      .string()
      .min(2, "Họ và tên phải tối thiểu 2 ký tự")
      .nonempty("Vui lòng nhập họ và tên"),
    email: z.email("Địa chỉ Email không hợp lệ"),
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(/[A-Z]/, "Phải chứa ít nhất 1 chữ hoa")
      .regex(/[a-z]/, "Phải chứa ít nhất 1 chữ thường")
      .regex(/[0-9]/, "Phải chứa ít nhất 1 số"),
    confirmPassword: z.string().nonempty("Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không trùng khớp",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  // 2. State quản lý thông báo thành công
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { registerAuth } = useAuth();
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = form;

  const onSubmit = async (values: RegisterFormValues) => {
    setLoading(true);
    setSuccessMessage(null);

    const result = await registerAuth({
      fullName: values.fullName,
      email: values.email,
      password: values.password,
    });

    if (result.success) {
      setSuccessMessage(
        "Đăng ký thành công! Đang chuyển đến trang đăng nhập..."
      );

      setTimeout(() => {
        navigate("/auth/login/customer");
      }, 3000);
    } else {
      setError("root", {
        type: "manual",
        message: result.message || "Đăng ký thất bại",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-700 ">
      <style>{autofillFixStyle}</style>
      <ScrollToTop />
      <main className="min-h-screen flex items-center justify-center p-10">
        <div className="w-full max-w-5xl bg-[#151517] bg-opacity-90 p-8 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col lg:flex-row gap-10 border border-gray-800">
          <div className="w-full lg:w-1/2">
            {/* Logo Section */}
            <div className="flex justify-center mb-4">
              {logo ? (
                <img
                  src={logo}
                  alt="Logo"
                  className="h-16 w-16 object-contain"
                />
              ) : (
                <h1 className="text-3xl font-bold text-white">LOGO</h1>
              )}
            </div>
            <h2 className="text-2xl font-bold text-center text-red-500 mb-2">
              Đăng ký tài khoản
            </h2>

            {successMessage && (
              <div className="p-3 mb-4 rounded-lg bg-green-500/10 border border-green-500/50 text-green-500 text-sm text-center flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
                <CheckCircle size={18} />
                {successMessage}
              </div>
            )}

            {errors.root && (
              <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm text-center">
                {errors.root.message}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Full Name */}
              <div className="relative">
                <input
                  type="text"
                  id="fullName"
                  placeholder=" "
                  disabled={loading}
                  {...register("fullName")}
                  className={`peer w-full px-4 pt-5 pb-2 text-white bg-[#151517] rounded-lg border 
                    ${errors.fullName ? "border-red-500" : "border-gray-600"} 
                     outline-none transition-all`}
                />
                <label
                  htmlFor="fullName"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base transition-all duration-200 cursor-text
                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
                    peer-focus:top-2 peer-focus:text-xs peer-focus:text-gray-200
                    peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-200"
                >
                  Họ và tên
                </label>
                {errors.fullName && (
                  <p className="text-red-500 text-xs ml-1 mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email */}
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
                {errors.email && (
                  <p className="text-red-500 text-xs ml-1 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
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
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-xs ml-1 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder=" "
                  disabled={loading}
                  {...register("confirmPassword")}
                  className={`peer w-full px-4 pt-5 pb-2 text-white bg-[#151517] rounded-lg border 
                    ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-600"
                    } 
                     outline-none transition-all`}
                />
                <label
                  htmlFor="confirmPassword"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base transition-all duration-200 cursor-text
                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
                    peer-focus:top-2 peer-focus:text-xs peer-focus:text-gray-200
                    peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-200"
                >
                  Nhập lại mật khẩu
                </label>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs ml-1 mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg shadow-red-900/20 mt-4 cursor-pointer"
              >
                {loading ? "Đang xử lý..." : "Đăng ký"}
              </button>
            </form>
            <p className="text-gray-400 text-sm text-center mt-6">
              Đã có tài khoản?{" "}
              <Link
                to="/auth/login/customer"
                className="text-md font-bold text-red-500 hover:underline"
              >
                Đăng nhập
              </Link>
            </p>
          </div>

          {/* Info Section */}
          <div className="w-full lg:w-1/2 text-gray-300 border-t lg:border-t-0 lg:border-l border-gray-700 pt-6 lg:pt-0 lg:pl-10 flex flex-col ">
            <h2 className="text-xl font-bold mb-6 text-red-500 border-b border-gray-700 pb-2 inline-block">
              Yêu cầu tài khoản
            </h2>
            <ul className="space-y-4 text-sm list-disc list-inside text-gray-400">
              <li className="marker:text-red-500">
                <span className="text-gray-300">Họ và tên:</span> Sử dụng tên
                thật, tối thiểu 2 ký tự.
              </li>
              <li className="marker:text-red-500">
                <span className="text-gray-300">Email:</span> Phải đúng định
                dạng.
              </li>
              <li className="marker:text-red-500">
                <span className="text-gray-300">Mật khẩu:</span> 8 ký tự, có
                hoa, thường và số.
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
