import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import userApi from "@/services/api/admin/userApi";
import type { IUser } from "@/types/user";

export default function UserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadUser = async () => {
      const res = await userApi.getById(id);
      setUser(res.data.data);
    };

    loadUser();
  }, [id]);

  if (!user) return <div className="p-10 text-lg">Đang tải...</div>;

  return (
    <div className="p-10 space-y-8">

      {/* Header Section */}
      <div className="flex items-center gap-6">
        <img
          src={user.avatarUrl}
          alt="Avatar"
          className="w-28 h-28 rounded-full object-cover shadow-md"
        />

        <div>
          <h1 className="text-3xl font-bold">{user.fullName}</h1>
          <p className="text-gray-600">{user.email}</p>

          <div className="flex gap-2 mt-2">
            <Badge variant="outline">Role: {user.role}</Badge>
            <Badge className={user.isActive ? "bg-green-600" : "bg-red-600"}>
              {user.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="addresses">Địa chỉ</TabsTrigger>
          <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
          <TabsTrigger value="roles">Phân quyền</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview">
          <Card className="mt-5">
            <CardHeader>
              <CardTitle>Thông tin chi tiết</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-md">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Số điện thoại:</strong> {user.phoneNumber || "Không có"}</p>
              <p><strong>Ngày tạo:</strong> {new Date(user.createdAt).toLocaleString()}</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ADDRESS TAB */}
        <TabsContent value="addresses">
          <Card className="mt-5">
            <CardHeader>
              <CardTitle>Địa chỉ giao hàng</CardTitle>
            </CardHeader>
            <CardContent>
              {user.addresses.length === 0 ? (
                <p className="text-gray-600">Không có địa chỉ.</p>
              ) : (
                <div className="space-y-4">
                  {user.addresses.map((addr, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <p>{addr.street}</p>
                        <p>{addr.ward}, {addr.district}, {addr.city}</p>
                      </div>
                      {addr.isDefault && (
                        <Badge className="bg-blue-600">Mặc định</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ORDERS TAB (DUMMY — YOU CAN CONNECT LATER) */}
        <TabsContent value="orders">
          <Card className="mt-5">
            <CardHeader>
              <CardTitle>Lịch sử đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Chưa có dữ liệu đơn hàng.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ROLE TAB */}
        <TabsContent value="roles">
          <Card className="mt-5">
            <CardHeader>
              <CardTitle>Phân quyền người dùng</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Role hiện tại: <strong>{user.role}</strong></p>
              <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md">
                Cập nhật role
              </button>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
