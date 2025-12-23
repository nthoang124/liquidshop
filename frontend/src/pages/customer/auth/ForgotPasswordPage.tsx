import { useState } from "react";
import { Link } from "react-router-dom";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

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

interface SubmitButtonProps {
  loading: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ loading }) => {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 
        text-white font-bold py-3 rounded-lg transition-all 
        shadow-lg shadow-red-900/20 disabled:cursor-not-allowed cursor-pointer"
    >
      <div className="flex items-center justify-center gap-2">
        {loading && <Loader2 className="h-5 w-5 animate-spin" />}
        <span>{loading ? "Đang gửi..." : "GỬI YÊU CẦU"}</span>
      </div>
    </button>
  );
};

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

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setLoading(true);
    setServerMessage(null);

    try {
      await authService.forgotPassword(values.email);

      setServerMessage({
        type: "success",
        content:
          "Link khôi phục mật khẩu đã được gửi! Vui lòng kiểm tra email (cả mục Spam).",
      });

      form.reset();
    } catch (error: any) {
      console.error("Forgot password error:", error);

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
    <div className="bg-neutral-700 font-sans">
      <style>{autofillFixStyle}</style>
      <ScrollToTop />

      <section className="min-h-screen flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md bg-[#151517] bg-opacity-90 p-8 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col gap-5 border border-gray-800">
          {/* Logo */}
          <div className="flex justify-center">
            {logo ? (
              <img src={logo} alt="Logo" className="h-20 w-20 object-contain" />
            ) : (
              <h1 className="text-3xl font-bold text-white">LOGO</h1>
            )}
          </div>

          {/* Title */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500">Quên mật khẩu?</h2>
            <p className="text-gray-400 text-sm mt-1">
              Nhập email đã đăng ký để nhận hướng dẫn đặt lại mật khẩu.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
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
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-all
              peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base
              peer-focus:top-2 peer-focus:text-xs peer-focus:text-gray-200
              peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs"
              >
                Email
              </label>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Server Message */}
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

            {/* Submit */}
            <SubmitButton loading={loading} />
          </form>

          {/* Links */}
          <div className="pt-2 text-center space-y-3">
            <p className="text-gray-400 text-sm">
              Nhớ mật khẩu?{" "}
              <Link
                to="/auth/login/customer"
                className="font-bold text-red-500 hover:underline"
              >
                Đăng nhập
              </Link>
            </p>

            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-white transition"
            >
              ← Quay về trang chủ
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
