import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import userApi from "@/services/api/admin/userApi";
import type { IUser } from "@/types/user";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import UpdateRoleAlert from "@/components/admin/users/update-role-alert";
import type { IOrder } from "@/types/order";
import orderApi from "@/services/api/admin/orderApi";
import OrderDetailDialog from "@/components/admin/orders/OrderDetailDialog";
import { formatDate } from "@/utils/formatDate";
import { formatVND } from "@/utils/admin/formatMoney";
import { getOrderStatusLabel } from "@/utils/admin/mapOrderDetail";
import { RoleBadge } from "@/components/admin/users/role-badege";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export default function UserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState<IUser | null>(null);
  const [openUpdateRole, setOpenUpdateRole] = useState(false);
  const [role, setRole] = useState(user?.role);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const navigate = useNavigate();

  const handleComeBack = () => {
    navigate("/admin/users");
  }

  const confirmUpdateRole = async () => {
    try {
      const updateRole = role === "admin" ? "customer" : "admin";
      const res = await userApi.updateRole(id ?? "", updateRole); 
      console.log("check update: ", res.data.message)
      setOpenUpdateRole(false);
      setRole(updateRole);
    }catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    if (!id) return;

    const loadUser = async () => {
      const res = await userApi.getById(id);
      setUser(res.data.data);
    };

    const loadOrders = async () => {
      const res = await orderApi.getAll({userId: id})
      setOrders(res.data.data);
    }

    loadOrders();
    loadUser();
  }, [id]);

  useEffect(() => {
    if (user) 
      setRole(user.role);
  }, [user]);


  if (!user) return <div className="p-10 text-lg">Đang tải...</div>;

  return (
    <div className="p-2 md:p-4 space-y-8">
       <div className="flex flex-col bg-white mt-4 p-5 gap-3 border-b border-gray-300">
        <Button 
          className="bg-white border border-gray-300 w-25 hover:bg-white hover:shadow-md justify-start text-black flex items-center gap-1"
          onClick={() => handleComeBack()}
        >
          <ChevronLeft size={28} color="black" strokeWidth={2.25}/>
          quay về
        </Button>

        <p className="text-2xl lg:text-2xl font-bold">Thông tin khách hàng</p>
        <p className="text-sm md:text-base text-gray-600">Thông tin chi tiết khách hàng</p>
      </div>

      {/* Header Section */}
      <div className="flex items-center gap-6">
       <Avatar className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-white shadow-sm">
          {user.avatarUrl && (
            <AvatarImage
              src={user.avatarUrl}
              alt={user.fullName}
              className="absolute inset-0 z-10 object-cover"
            />
          )}

          <AvatarFallback
            className="absolute inset-0 z-20 flex items-center justify-center 
                      bg-slate-100 text-slate-500 font-bold text-xl"
          >
            {user.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-base md:text-xl font-bold">{user.fullName}</h1>
          <p className="text-gray-600 text-sm md:text-base">{user.email}</p>

          <div className="flex gap-2 mt-2">
            <RoleBadge role={user.role} label={user.role === "admin" ? "Quản trị viên" : "Người dùng"}/>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-gray-200 w-full max-w-100">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="addresses">Địa chỉ</TabsTrigger>
          <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
          <TabsTrigger value="roles">Phân quyền</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview">
          <Card className="mt-5">
            <CardHeader>
              <CardTitle className="text-md md:text-lg">Thông tin chi tiết</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
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
              {user.addresses?.length === 0 ? (
                <p className="text-gray-600 text-sm">Không có địa chỉ.</p>
              ) : (
                <div className="space-y-4">
                  {user.addresses?.map((addr, index) => (
                    <div
                      key={index}
                      className="p-4 border text-sm rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <p>{addr.street}</p>
                        <p>{addr.ward} {addr.city}</p>
                      </div>
                      {addr.isDefault && (
                        <Badge className="bg-blue-600 text-sm">Mặc định</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ORDERS TAB */}
        <TabsContent value="orders">
          <Card className="mt-5">
            <CardHeader>
              <CardTitle>Lịch sử đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.map((o) => (
                <div
                  key={o._id}
                  className="border border-gray-300 rounded-xl p-4 shadow-sm transition cursor-pointer bg-white"
                  onClick={() => {
                    setOpenOrderDialog(true);
                    setSelectedOrder(o);
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-blue-600 text-sm md:text-base">
                      #{o.orderCode}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(o.createdAt)}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm">{getOrderStatusLabel(o.orderStatus)}</p>
                    <p className="text-red-500 font-bold">{formatVND(o.totalAmount)}</p>
                  </div>
                </div>
              ))}
            </div>
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
              <p className="text-sm">Role hiện tại: <strong>{role}</strong></p>
              <button 
                className="mt-3 text-sm px-4 py-2 bg-blue-600 text-white rounded-md"
                onClick={() =>setOpenUpdateRole(true)}
              >
                Cập nhật quyền
              </button>
            </CardContent>
          </Card>
        </TabsContent>

        <UpdateRoleAlert
          role={role}
          setOpen={setOpenUpdateRole}
          open={openUpdateRole}
          onConfirm={confirmUpdateRole}
        />

        <OrderDetailDialog
          open={openOrderDialog}
          setOpen={setOpenOrderDialog}
          order={selectedOrder}
        />

      </Tabs>
    </div>
  );
}
