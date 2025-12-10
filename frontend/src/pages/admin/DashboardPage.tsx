import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatVND } from "@/utils/admin/formatMoney";
import { DollarSign, ShoppingCart, Tag, UserRound } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="p-3 bg-white space-y-4">
            <div className="flex flex-col bg-white mt-4 px-8 gap-3 border-b border-gray-300 pb-3 pt-3">
              <p className="text-2xl lg:text-3xl font-bold">Dashboard</p>
              <p className="text-md md:text-lg text-gray-600">Tổng quan về hoạt động kinh doanh và chỉ số quan trọng</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5 px-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <p className="text-md font-semibold text-zinc-500">Tổng doanh thu</p>
                        <DollarSign className="text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{3000000}</p>
                        <p className="text-sm text-gray-500">Trong 30 ngày gần nhất</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <p className="text-md font-semibold text-zinc-500">Tổng đơn hàng</p>
                        <ShoppingCart size={28} color="#0b35e0" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{3000000}</p>
                        <p className="text-sm text-gray-500">Trong 30 ngày gần nhất</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <p className="text-md font-semibold text-zinc-500">Tổng khách hàng</p>
                        <UserRound size={28} color="#800be0" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{3000000}</p>
                        <p className="text-sm text-gray-500">Trong 30 ngày gần nhất</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <p className="text-md font-semibold text-zinc-500">Tổng sản phẩm</p>
                        <Tag size={28} color="#ddec09" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{3000000}</p>
                        <p className="text-sm text-gray-500">Trong 30 ngày gần nhất</p>
                    </CardContent>
                </Card>
                

                    {/* Các KPI khác tương tự */}
            </div>
            {/* <div className="flex flex-col bg-white md:flex-row gap-4 items-center justify-center mt-4 px-6 py-3">
                <div className="bg-white border border-gray-200 rounded-xl md:flex-col lg:flex-row p-6 shadow-sm hover:shadow-md transition w-full md:w-1/3 flex items-center justify-between">
                    <p className="text-base font-semibold">Tổng doanh thu</p>
                    <div className="flex flex-row items-center gap-2">
                        <p className="text-xl lg:text-2xl font-bold">{}</p>
                        <CircleDollarSign size={32} color="#0055ff" />
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl md:flex-col lg:flex-row p-6 shadow-sm hover:shadow-md transition w-full md:w-1/3 flex items-center justify-between">
                    <p className="text-base font-semibold">Đơn hàng</p>
                    <div className="flex flex-row items-center gap-2">
                        <p className="text-xl lg:text-2xl font-bold">{}</p>
                        <ShoppingCart size={32} color="#0be035" />
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl md:flex-col lg:flex-row p-6 shadow-sm hover:shadow-md transition w-full md:w-1/3 flex items-center justify-between">
                    <p className="text-base font-semibold">Khách hàng</p>
                    <div className="flex flex-row items-center gap-2">
                        <p className="text-xl lg:text-2xl font-bold">{}</p>
                        <UserRound size={32} color="#800be0" />
                    </div>
                </div>
            </div> */}
        </div>
    )
}