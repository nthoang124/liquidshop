import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, ShoppingBag, Loader2, Key } from "lucide-react";

import { useAuth } from "@/context/CustomerAuthContext";
import AddressManager from "./AddressManager";
import PasswordChanger from "./PasswordChanger";
import MyOrders from "./MyOrders";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { toast } from "sonner";

// --- SCHEMAS ---
const addressSchema = z.object({
  street: z.string().min(1, "Vui lòng nhập địa chỉ cụ thể"),
  ward: z.string().min(1, "Vui lòng nhập Phường/Xã"),
  district: z.string().min(1, "Vui lòng nhập Quận/Huyện"),
  city: z.string().min(1, "Vui lòng nhập Tỉnh/Thành phố"),
  isDefault: z.boolean().default(false),
});

const profileSchema = z.object({
  fullName: z.string().min(2, "Tên hiển thị phải ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phoneNumber: z
    .string()
    .regex(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ")
    .optional()
    .or(z.literal("")),
  addresses: z.array(addressSchema).optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, updateUser, changePassword } = useAuth();
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<"profile" | "password" | "orders">(
    "profile"
  );

  useEffect(() => {
    const hash = location.hash;

    if (hash === "#orders-history") {
      setActiveTab("orders");
    } else if (hash === "#password-change") {
      setActiveTab("password");
    } else {
      setActiveTab("profile");
    }
  }, [location.hash]);

  const handleTabChange = (tab: "profile" | "orders" | "password") => {
    setActiveTab(tab);

    const hashMap = {
      profile: "", // Về mặc định, xóa hash
      orders: "#orders-history",
      password: "#password-change",
    };

    navigate(`/users/me${hashMap[tab]}`, { replace: true });
  };

  const [selectedAddrIndex, setSelectedAddrIndex] = useState<string>("0");

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      addresses: [],
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        addresses:
          user.addresses && user.addresses.length > 0
            ? user.addresses.map((addr) => ({
                street: addr.street || "",
                ward: addr.ward || "",
                district: addr.district || "",
                city: addr.city || "",
                isDefault: addr.isDefault || false,
              }))
            : [],
      });

      if (user.addresses && user.addresses.length > 0) {
        const defaultIndex = user.addresses.findIndex((a) => a.isDefault);
        setSelectedAddrIndex(
          defaultIndex !== -1 ? defaultIndex.toString() : "0"
        );
      }
    }
  }, [user, profileForm]);

  // --- HANDLERS ---
  const onProfileSubmit = async (values: ProfileFormValues) => {
    setLoading(true);
    try {
      const result = await updateUser(values);

      if (result.success) {
        toast.success("Cập nhật thành công!", {
          description: "Hồ sơ và địa chỉ của bạn đã được lưu.",
        });
      } else {
        toast.error("Lỗi cập nhật!", {
          description:
            result.message || "Không thể cập nhật hồ sơ. Vui lòng thử lại.",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi hệ thống!", {
        description: "Đã xảy ra lỗi kết nối server.",
      });
    } finally {
      setLoading(false);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-900 text-slate-50">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* --- SIDEBAR MENU --- */}
          <aside className="w-full md:w-1/4">
            <Card className="bg-[#151517] border-neutral-800 text-slate-200 shadow-xl sticky top-4">
              <CardContent className="p-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center mb-6 pb-6 border-b border-neutral-800">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 border-2 border-neutral-700">
                      <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                      <AvatarFallback className="bg-red-600 text-white text-2xl font-bold">
                        {user.fullName?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <h3 className="mt-4 font-bold text-lg text-white">
                    {user.fullName}
                  </h3>
                  <p className="text-neutral-500 text-sm break-all">
                    {user.email}
                  </p>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-2">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-3 ${
                      activeTab === "profile"
                        ? "bg-red-600/10 text-red-500 hover:bg-red-600/20 hover:text-red-500"
                        : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                    }`}
                    onClick={() => handleTabChange("profile")}
                  >
                    <User className="w-4 h-4" /> Hồ sơ của tôi
                  </Button>

                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-3 ${
                      activeTab === "orders"
                        ? "bg-red-600/10 text-red-500 hover:bg-red-600/20 hover:text-red-500"
                        : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                    }`}
                    onClick={() => handleTabChange("orders")}
                  >
                    <ShoppingBag className="w-4 h-4" /> Đơn mua
                  </Button>

                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-3 ${
                      activeTab === "password"
                        ? "bg-red-600/10 text-red-500 hover:bg-red-600/20 hover:text-red-500"
                        : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                    }`}
                    onClick={() => handleTabChange("password")}
                  >
                    <Key className="w-4 h-4" /> Đổi mật khẩu
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* --- MAIN CONTENT --- */}
          <section className="w-full md:w-3/4">
            {/* TAB: PROFILE */}
            {activeTab === "profile" && (
              <Card className="bg-[#151517] border-neutral-800 text-slate-200 shadow-xl">
                <CardHeader className="border-b border-neutral-800 pb-6">
                  <CardTitle className="text-2xl font-bold text-white">
                    Hồ sơ của tôi
                  </CardTitle>
                  <CardDescription className="text-neutral-400">
                    Quản lý thông tin hồ sơ và địa chỉ giao hàng
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Form {...profileForm}>
                    <form
                      onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                      className="space-y-6"
                    >
                      {/* --- BASIC INFO --- */}
                      <div className="space-y-4">
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center space-y-0">
                              <FormLabel className="text-neutral-400 md:text-right">
                                Email
                              </FormLabel>
                              <div className="md:col-span-3">
                                <FormControl>
                                  <Input
                                    {...field}
                                    disabled
                                    className="bg-neutral-800 border-neutral-700 text-neutral-400 cursor-not-allowed"
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center space-y-0">
                              <FormLabel className="text-neutral-400 md:text-right">
                                Tên hiển thị
                              </FormLabel>
                              <div className="md:col-span-3">
                                <FormControl>
                                  <Input
                                    {...field}
                                    className="bg-[#2a2a2c] border-neutral-600 text-white focus:border-red-500"
                                  />
                                </FormControl>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center space-y-0">
                              <FormLabel className="text-neutral-400 md:text-right">
                                Số điện thoại
                              </FormLabel>
                              <div className="md:col-span-3">
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="09xx..."
                                    className="bg-[#2a2a2c] border-neutral-600 text-white focus:border-red-500"
                                  />
                                </FormControl>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      <Separator className="bg-neutral-800 my-6" />

                      <AddressManager
                        selectedAddrIndex={selectedAddrIndex}
                        setSelectedAddrIndex={setSelectedAddrIndex}
                        onProfileSubmit={onProfileSubmit}
                        loading={loading}
                      />

                      {/* Submit Button */}
                      <div className="flex justify-end pt-4">
                        <Button
                          type="submit"
                          disabled={loading}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 w-full md:w-auto"
                        >
                          {loading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Lưu tất cả thay đổi
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {activeTab === "orders" && <MyOrders />}

            {/* TAB: PASSWORD */}
            {activeTab === "password" && (
              <PasswordChanger changePassword={changePassword} />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
