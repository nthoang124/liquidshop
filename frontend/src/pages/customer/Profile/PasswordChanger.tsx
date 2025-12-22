// src/pages/customer/Profile/PasswordChanger.tsx

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Key, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import ScrollToTop from "@/components/common/ScrollToTop";

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    newPassword: z
      .string()
      .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự")
      .regex(/[A-Z]/, "Phải chứa ít nhất 1 chữ hoa")
      .regex(/[a-z]/, "Phải chứa ít nhất 1 chữ thường")
      .regex(/[0-9]/, "Phải chứa ít nhất 1 số"),
    confirmNewPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmNewPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

interface PasswordChangerProps {
  changePassword: (
    oldPassword: string,
    newPassword: string
  ) => Promise<{ success: boolean; message?: string }>;
}

const PasswordChanger: React.FC<PasswordChangerProps> = ({
  changePassword,
}) => {
  const [loading, setLoading] = useState(false);

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onPasswordSubmit = async (values: PasswordFormValues) => {
    setLoading(true);
    try {
      const result = await changePassword(
        values.oldPassword,
        values.newPassword
      );

      if (result.success) {
        toast.success("Đổi mật khẩu thành công!", {
          description: "Mật khẩu của bạn đã được thay đổi.",
        });
        passwordForm.reset();
      } else {
        toast.error("Đổi mật khẩu thất bại!", {
          description:
            result.message || "Mật khẩu cũ không chính xác hoặc lỗi server.",
        });
      }
    } catch (error) {
      toast.error("Lỗi hệ thống!", {
        description: "Đã xảy ra lỗi khi đổi mật khẩu.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-[#151517] border-neutral-800 text-slate-200 shadow-xl">
      <ScrollToTop />
      <CardHeader className="border-b border-neutral-800 pb-6">
        <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
          <Key className="w-6 h-6 text-red-500" /> Đổi mật khẩu
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-6 max-w-3xl"
          >
            {/* Old Password */}
            <FormField
              control={passwordForm.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center space-y-0">
                  <FormLabel className="text-neutral-400 md:text-right">
                    Mật khẩu cũ
                  </FormLabel>
                  <div className="md:col-span-3">
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        className="bg-[#2a2a2c] border-neutral-600 text-white focus:border-red-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* New Password */}
            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center space-y-0">
                  <FormLabel className="text-neutral-400 md:text-right">
                    Mật khẩu mới
                  </FormLabel>
                  <div className="md:col-span-3">
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        className="bg-[#2a2a2c] border-neutral-600 text-white focus:border-red-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Confirm New Password */}
            <FormField
              control={passwordForm.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center space-y-0">
                  <FormLabel className="text-neutral-400 md:text-right">
                    Xác nhận mật khẩu
                  </FormLabel>
                  <div className="md:col-span-3">
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        className="bg-[#2a2a2c] border-neutral-600 text-white focus:border-red-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 w-full md:w-auto"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Cập nhật mật khẩu
              </Button>
            </div>
          </form>
        </Form>
        <p>
          <span className="text-red-600 italic">
            <strong>*Lưu ý:</strong>{" "}
          </span>{" "}
          <span className="text-sm">
            Mật khẩu có tối thiểu 8 ký tự, có hoa, thường và số.
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default PasswordChanger;
