import { useState } from "react";
import { Link } from "react-router-dom";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Import Service và Assets
import { authService } from "@/services/api/customer/auth.service";
import logo from "@/assets/icons/TL-Logo.png";
import Footer from "@/components/common/Footer";

import ScrollToTop from "@/components/common/ScrollToTop";

const schema = z.object({
  email: z
    .string()
    .min(1, "Vui lòng nhập email")
    .email("Định dạng email không hợp lệ"),
});

type ForgotPasswordFormValues = z.infer<typeof schema>;

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

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [serverMessage, setServerMessage] = useState<{
    type: "success" | "error";
    content: string;
  } | null>(null);

  // Setup React Hook Form
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  // --- 3. XỬ LÝ SUBMIT ---
  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setLoading(true);
    setServerMessage(null);

    try {
      // Gọi API thông qua Service
      await authService.forgotPassword(values.email);

      // Backend trả về thành công (thường là 200 OK)
      setServerMessage({
        type: "success",
        content:
          "Link khôi phục mật khẩu đã được gửi! Vui lòng kiểm tra email (cả mục Spam).",
      });

      // Tùy chọn: Reset form sau khi gửi thành công
      form.reset();
    } catch (error: any) {
      console.error("Forgot password error:", error);

      // Xử lý lỗi từ Backend trả về
      const msg =
        error.response?.data?.message ||
        "Không thể gửi yêu cầu. Vui lòng thử lại sau.";

      setServerMessage({
        type: "error",
        content: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-700 font-sans">
      <style>{autofillFixStyle}</style>
      <ScrollToTop />
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
            <h2 className="text-2xl font-bold text-red-500 mb-2">
              Quên mật khẩu?
            </h2>
            <p className="text-gray-400 text-sm">
              Nhập email đã đăng ký để nhận hướng dẫn đặt lại mật khẩu.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-2">
            {/* Input Email */}
            <div className="space-y-1">
              <div className="relative">
                <input
                  type="email"
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
                <p className="text-red-500 text-xs ml-1 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Thông báo Server (Success/Error) */}
            {serverMessage && (
              <div
                className={`p-3 rounded-lg text-sm text-center border ${
                  serverMessage.type === "success"
                    ? "bg-green-500/10 border-green-500/50 text-green-500"
                    : "bg-red-500/10 border-red-500/50 text-red-500"
                }`}
              >
                {serverMessage.content}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg shadow-red-900/20 cursor-pointer"
            >
              <div className="flex justify-center items-center gap-2">
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-100"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                    <span>Đang gửi...</span>
                  </>
                ) : (
                  "GỬI YÊU CẦU"
                )}
              </div>
            </button>
          </form>

          {/* Navigation Links */}
          <div className="mt-4 space-y-3 text-center">
            <p className="text-gray-400 text-sm">
              Nhớ mật khẩu?{" "}
              <Link
                to="/auth/login/customer"
                className="text-md font-bold text-red-500 hover:underline transition-all"
              >
                Đăng nhập
              </Link>
            </p>

            <Link
              to="/"
              className="inline-block text-sm text-gray-500 hover:text-white transition-colors"
            >
              ← Quay về trang chủ
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
