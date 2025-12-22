import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useAuth } from "@/context/CustomerAuthContext";
import logo from "@/assets/icons/TL-Logo.png";
import loginBg from "@/assets/images/auth-bg.jpg";
import Footer from "@/components/common/Footer";
import ScrollToTop from "@/components/common/ScrollToTop";
import useDocumentTitle from "@/hooks/useDocumentTitle";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

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
    fullName: z.string().min(2, "Họ và tên phải tối thiểu 2 ký tự"),
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
  useDocumentTitle("Tạo tài khoản");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { registerAuth } = useAuth();
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

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
      setTimeout(() => navigate("/auth/login/customer"), 3000);
    } else {
      form.setError("root", { message: result.message || "Đăng ký thất bại" });
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-neutral-700 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <style>{autofillFixStyle}</style>
      <ScrollToTop />
      <div className="flex-1 w-full bg-black/60 flex flex-col">
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10 lg:p-12">
          <div className="w-full max-w-lg lg:max-w-5xl bg-[#151517]/90 p-6 sm:p-8 md:p-10 rounded-sm shadow-2xl backdrop-blur-md flex flex-col lg:flex-row gap-8 lg:gap-10 border border-gray-800">
            <div className="w-full lg:w-1/2">
              <div className="flex justify-center mb-6">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-14 w-14 sm:h-16 sm:w-16 object-contain"
                />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-center text-white mb-6 uppercase">
                Đăng ký tài khoản
              </h2>

              {successMessage && (
                <div className="p-3 mb-5 rounded bg-green-500/10 border border-green-500/50 text-green-500 text-sm text-center flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
                  <CheckCircle size={18} /> {successMessage}
                </div>
              )}

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* Full Name */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder=" "
                              {...field}
                              className="peer w-full px-4 pt-6 pb-2 text-white bg-transparent rounded border-gray-600 focus:border-red-500 h-auto"
                            />
                            <label className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base transition-all duration-200 cursor-text pointer-events-none peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-gray-200 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-200">
                              Họ và tên
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs ml-1" />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder=" "
                              {...field}
                              className="peer w-full px-4 pt-6 pb-2 text-white bg-transparent rounded border-gray-600 focus:border-red-500 h-auto"
                            />
                            <label className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base transition-all duration-200 cursor-text pointer-events-none peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-gray-200 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-200">
                              Email
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs ml-1" />
                      </FormItem>
                    )}
                  />

                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder=" "
                              {...field}
                              className="peer w-full px-4 pt-6 pb-2 text-white bg-transparent rounded border-gray-600 focus:border-red-500 h-auto"
                            />
                            <label className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base transition-all duration-200 cursor-text pointer-events-none peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-gray-200 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-200">
                              Mật khẩu
                            </label>
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                            >
                              {showPassword ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs ml-1" />
                      </FormItem>
                    )}
                  />

                  {/* Confirm Password */}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="password"
                              placeholder=" "
                              {...field}
                              className="peer w-full px-4 pt-6 pb-2 text-white bg-transparent rounded border-gray-600 focus:border-red-500 h-auto"
                            />
                            <label className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base transition-all duration-200 cursor-text pointer-events-none peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-gray-200 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-200">
                              Nhập lại mật khẩu
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs ml-1" />
                      </FormItem>
                    )}
                  />

                  {form.formState.errors.root && (
                    <div className="p-3 rounded bg-red-500/10 border border-red-500/50 text-red-500 text-sm text-center">
                      {form.formState.errors.root.message}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900/50 text-white font-bold py-6 rounded transition-all mt-4"
                  >
                    {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG KÝ"}
                  </Button>
                </form>
              </Form>

              <p className="text-gray-400 text-sm text-center mt-6">
                Đã có tài khoản?{" "}
                <Link
                  to="/auth/login/customer"
                  className="text-red-500 font-bold hover:underline ml-1"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
            <div className="w-full lg:w-1/2 text-gray-300 border-t lg:border-t-0 lg:border-l border-gray-700/50 pt-8 lg:pt-0 lg:pl-10 flex flex-col justify-center">
              <h2 className="text-lg font-bold mb-6 text-red-500 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-red-500"></span>
                YÊU CẦU TÀI KHOẢN
              </h2>
              <ul className="space-y-6 text-sm">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 font-bold text-sm">
                    1
                  </div>
                  <div>
                    <span className="text-gray-100 font-semibold block mb-1">
                      Họ và tên
                    </span>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Sử dụng tên thật để thuận tiện cho việc nhận hàng và bảo
                      hành, tối thiểu 2 ký tự.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 font-bold text-sm">
                    2
                  </div>
                  <div>
                    <span className="text-gray-100 font-semibold block mb-1">
                      Email chính chủ
                    </span>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Hệ thống sẽ gửi hóa đơn và thông báo trạng thái đơn hàng
                      qua email này.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 font-bold text-sm">
                    3
                  </div>
                  <div>
                    <span className="text-gray-100 font-semibold block mb-1">
                      Mật khẩu bảo mật
                    </span>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Tối thiểu 8 ký tự, bao gồm ít nhất một chữ hoa, một chữ
                      thường và một chữ số.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            ;
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
