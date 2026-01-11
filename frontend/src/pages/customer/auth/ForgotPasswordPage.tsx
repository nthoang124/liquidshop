import { useState } from "react";
import { Link } from "react-router-dom";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, MailCheck } from "lucide-react";

import { authService } from "@/services/api/customer/auth.service";
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
  email: z
    .string()
    .min(1, "Vui lòng nhập email")
    .email("Định dạng email không hợp lệ"),
});

type ForgotPasswordFormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  useDocumentTitle("Quên mật khẩu");
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState<{
    type: "success" | "error";
    content: string;
  } | null>(null);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setLoading(true);
    setServerMessage(null);
    try {
      await authService.forgotPassword(values.email);
      setServerMessage({
        type: "success",
        content: "Yêu cầu đã được gửi! Vui lòng kiểm tra email của bạn.",
      });
    } catch (error: any) {
      setServerMessage({
        type: "error",
        content:
          error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] bg-[#151517]/95 p-6 sm:p-8 md:p-10 rounded-sm shadow-2xl backdrop-blur-md flex flex-col gap-6 border border-gray-800 animate-in fade-in zoom-in-95 duration-300">
      {/* Logo Section */}
      <div className="flex justify-center">
        <img
          src={logo}
          alt="Logo"
          className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
        />
      </div>

      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 uppercase tracking-tight">
          Quên mật khẩu?
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm">
          Nhập email của bạn để nhận liên kết khôi phục
        </p>
      </div>

      {serverMessage && (
        <div
          className={`p-3 rounded text-xs sm:text-sm text-center border animate-in fade-in zoom-in-95 flex items-center justify-center gap-2 ${
            serverMessage.type === "success"
              ? "bg-green-500/10 border-green-500/50 text-green-500"
              : "bg-red-500/10 border-red-500/50 text-red-500"
          }`}
        >
          {serverMessage.type === "success" && <MailCheck size={18} />}
          {serverMessage.content}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      Email khôi phục
                    </label>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 text-[10px] sm:text-xs ml-1 mt-1" />
              </FormItem>
            )}
          />

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
              "GỬI YÊU CẦU"
            )}
          </Button>
        </form>
      </Form>

      <div className="space-y-4 pt-2">
        <p className="text-gray-400 text-xs sm:text-sm text-center">
          Nhớ mật khẩu?{" "}
          <Link
            to="/auth/login/customer"
            className="font-bold text-red-500 hover:text-red-400 hover:underline transition-all ml-1"
          >
            Đăng nhập ngay
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
