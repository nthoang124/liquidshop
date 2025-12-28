import PageTitle from "@/components/admin/common/PageTitle";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatVND } from "@/utils/admin/formatMoney";
import { DollarSign, ShoppingCart, Tag, UserRound } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="p-2 md:p-4 bg-white space-y-4">
            <PageTitle title="Quản lí doanh thu" subTitle="Tổng quan về hoạt động kinh doanh và chỉ số quan trọng"/>
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
        </div>
    )
}