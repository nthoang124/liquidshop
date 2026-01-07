import { ChartBarMixed, type BarChartItem } from "@/components/admin/common/ChartBarMixed";
import { ChartLineDots } from "@/components/admin/common/ChartLineDots";
import { type LineChartItem } from "@/components/admin/common/ChartLineLinear";
import PageTitle from "@/components/admin/common/PageTitle";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import dashboardApi from "@/services/api/admin/dashboardApi";
import type { DashboardTotals } from "@/types/dashboard";
import type { IProduct } from "@/types/product";
import { CircleDollarSign, ShoppingCart, Tag, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { formatVND } from "@/utils/admin/formatMoney";
import { TopProducts } from "@/components/admin/dashboard/TopProducts";
import { NewUserList } from "@/components/admin/dashboard/NewUsersList";
import type { IUser } from "@/types/user";
import { ChartBarActive } from "@/components/admin/common/ChartBar";

export default function DashboardPage() {
    const USER_COLORS = [
        "#ef4444", // red-500
        "#22c55e", // green-500
        "#eab308", // yellow-500
        "#3b82f6", // blue-500
        "#a855f7", // purple-500
        "#a855f7", // purple-500
        "#14b8a6", // teal
    ];

    function mapLineChartData(
        labels: string[],
        data: number[]
        ): LineChartItem[] {
        return labels.map((label, index) => ({
            label,
            value: data[index] ?? 0,
        }))
    }

    function mapBarChartData(
        labels: string[],
        data: number[],
        color: string
        ): BarChartItem[] {
        return labels.map((label, index) => ({
            label,
            value: data[index] ?? 0,
            color: USER_COLORS[index]
        }))
    }

    function mapBarChartActiveData(
        labels: string[],
        data: number[],
        color: string
        ): BarChartItem[] {
            return labels.map((label, index) => ({
            label,
            value: data[index] ?? 0,
            color
        }))
    }

    const [totals, setTotals] = useState<DashboardTotals>({
        ordersLastMonth: 0,
        ordersThisMonth: 0,
        users: 0,
        products: 0,
        revenueThisYear: 0,
        revenueLastYear: 0,
        revenueThisMonth: 0,
        revenueLastMonth: 0,
    });

    const [topProducts, setTopProducts] = useState<IProduct[]>([]);
    const [newUsers, setNewUsers] = useState<IUser[]>([]);

    const [usersChart, setUsersChart] = useState<BarChartItem[]>([]);
    const [weekRevenueChart, setWeekRevenueChart] = useState<LineChartItem[]>([]);
    const [revenueMonthChart, setRevenueMonthChart] = useState<BarChartItem[]>([]);

    const [totalRevenue7Day, setTotalRevenue7Day] = useState(0);
    const [totalUser7Day, setTotalUsers7Day] = useState(0);

    const revenueMonthChartConfig = {
        value: {
            label: "Doanh thu",
            color: "var(--chart-2)"
        }
    }

    const usersChartConfig = {
        value: {
            label: "Khách hàng",
            color: "var(--chart-2)",
        }
    }

    const weekRevenueChartConfig = {
        value: {
            label: "Doanh thu",
            color: "var(--chart-2)"
        }
    }

    const loadData = async () => {
        try {
            const res = await dashboardApi.get();
            console.log("check res: ", res.data.data);
            console.log("check res: ", res.data);
            setTotals(res.data.totals);
            setTopProducts(res.data.topProducts.slice(0, 5));
            setNewUsers(res.data.topNewUsers.slice(0, 5));

            const revenueMonthChartData = mapBarChartActiveData(
                res.data.revenue12Months.labels,
                res.data.revenue12Months.data,
                "var(--chart-2)"
            );

            const userChartData = mapBarChartData(
                res.data.usersNew7Days.labels,
                res.data.usersNew7Days.data,
            );

            const weekRevenueChartData = mapLineChartData(
                res.data.revenue7Days.labels,
                res.data.revenue7Days.data,
            );

            setRevenueMonthChart(revenueMonthChartData);
            setUsersChart(userChartData);
            setWeekRevenueChart(weekRevenueChartData);

            const revenue7Day = weekRevenueChartData.reduce((total, item) => total + item.value, 0);
            const user7Day = userChartData.reduce((total, item) => total + item.value, 0);
            setTotalRevenue7Day(revenue7Day);
            setTotalUsers7Day(user7Day);
            
        }catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        try {
            const fetchData = () => {
                loadData();
            }
            fetchData();
        }catch(error) {
            console.log(error);
        }
    }, [])

    return (
        <div className="p-2 md:p-4 bg-white space-y-4">
            <PageTitle title="Quản lí doanh thu" subTitle="Tổng quan về hoạt động kinh doanh và chỉ số quan trọng"/>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5 px-3">
                <Card className="rounded-md shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <p className="text-md font-semibold text-zinc-600">Tổng doanh thu</p>
                        <div className="h-9 w-9 rounded-md bg-green-100 flex items-center justify-center">
                            <CircleDollarSign className="h-5 w-5 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">
                            <CountUp
                                end={totals.revenueThisYear}
                                duration={1}
                                easingFn={(t, b, c, d) => {
                                    // easeOutCubic
                                    t /= d;
                                    t--;
                                    return c * (t * t * t + 1) + b;
                                }}
                                formattingFn={(v) => v.toLocaleString("vi-VN") + " ₫"}
                            />
                        </p>
                        <div className="flex flex-row">
                            {totals.revenueThisYear >= totals.revenueLastYear ? (
                                <p className="text-sm text-green-500 mr-2">
                                    <TrendingUp color="#04eb00" /> 
                                    {(((totals.revenueThisYear - totals.revenueLastYear) / (totals.revenueLastYear || 1)) * 100).toFixed(2)}%
                                </p>
                            ) : (
                                <p className="flex flex-row items-center gap-1 text-sm text-red-500 mr-2">
                                    <TrendingDown color="#eb0000" /> 
                                    {(((totals.revenueLastYear - totals.revenueThisYear) / (totals.revenueLastYear || 1)) * 100).toFixed(2)}%
                                </p>
                            )}
                            <p className="text-sm text-gray-500">so với năm trước</p>
                        </div>
                    </CardContent>
                </Card >
                <Card className="rounded-md shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-1">
                        <p className="text-md font-semibold text-zinc-600">Doanh thu tháng này</p>
                        <div className="h-9 w-9 rounded-md bg-blue-100 flex items-center justify-center">
                            <CircleDollarSign className="h-5 w-5 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">
                            <CountUp
                                end={totals.revenueThisMonth}
                                duration={1}
                                easingFn={(t, b, c, d) => {
                                    // easeOutCubic
                                    t /= d;
                                    t--;
                                    return c * (t * t * t + 1) + b;
                                }}
                                formattingFn={(v) => v.toLocaleString("vi-VN") + " ₫"}
                            />
                        </p>
                        <div className="flex flex-row">
                            {totals.revenueThisMonth >= totals.revenueLastMonth ? (
                                <p className="text-sm text-green-500 mr-2">
                                    <TrendingUp color="#04eb00" /> 
                                    {(((totals.revenueThisMonth - totals.revenueLastMonth) / (totals.revenueLastMonth || 1)) * 100).toFixed(2)}%
                                </p>
                            ) : (
                                <p className="flex flex-row items-center gap-1 text-sm text-red-500 mr-2">
                                    <TrendingDown color="#eb0000" /> 
                                    {(((totals.revenueLastMonth - totals.revenueThisMonth) / (totals.revenueLastMonth || 1)) * 100).toFixed(2)}%
                                </p>
                            )}
                            <p className="text-sm text-gray-500">so với tháng trước</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-md shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-1">
                        <p className="text-md font-semibold text-zinc-600">Tổng đơn hàng</p>
                        <div className="h-9 w-9 rounded-md bg-purple-100 flex items-center justify-center">
                            <ShoppingCart className="h-5 w-5 text-purple-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{totals.ordersThisMonth}</p>
                        <div className="flex flex-row">
                        {totals.ordersThisMonth >= totals.ordersLastMonth ? (
                            <div className="flex flex-row">
                                <p className="text-sm text-green-500 mr-2">
                                    <TrendingUp color="#04eb00" /> 
                                    {(((totals.ordersThisMonth - totals.ordersLastMonth) / (totals.ordersLastMonth || 1)) * 100).toFixed(2)}%
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-row">
                                <p className="flex flex-row items-center gap-1 text-sm text-red-500 mr-2">
                                    <TrendingDown color="#eb0000" /> 
                                    {(((totals.ordersLastMonth - totals.ordersThisMonth) / (totals.ordersLastMonth || 1)) * 100).toFixed(2)}%
                                </p>
                            </div>
                        )}
                        <p className="text-sm text-gray-500">so với tháng trước</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-md shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-1">
                        <p className="text-md font-semibold text-zinc-600">Tổng sản phẩm</p>
                        <div className="h-9 w-9 rounded-md bg-amber-50 flex items-center justify-center">
                            <Tag size={28} color="#f1dd04" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{totals.products}</p>
                        <p className="text-sm text-gray-500">sản phẩm</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch px-3 mt-8 gap-5 justify-center">
                <div className="md:col-span-2">
                    <ChartBarActive
                        chartData={revenueMonthChart}
                        chartConfig={revenueMonthChartConfig}
                        dataKey="value"
                        titelChart="Doanh thu 12 tháng gần nhất"
                        subTitle="Doanh thu theo từng tháng"
                    />
                </div>
                <div className="flex col-span-1 gap-4 flex-col md:col-span-2 sm:flex-row sm:gap-5 sm:justify-center sm:w-full lg:flex-col lg:h-full lg:col-span-1 lg:gap-4">
                    <div className="lg:flex-1">

                    <ChartLineDots
                        chartData={weekRevenueChart}
                        chartConfig={weekRevenueChartConfig}
                        dataKey="value"
                        titelChart="Doanh thu 7 ngày qua"
                        subTitle={`Tổng doanh thu: ${formatVND(totalRevenue7Day)}`}
                    />
                    </div>

                    <div className="lg:flex-1">
                    <ChartBarMixed
                        chartData={usersChart}
                        chartConfig={usersChartConfig}
                        dataKey="value"
                        titelChart="Khách hàng mới trong 7 ngày qua"
                        subTitle={`Tổng khách hàng mới: ${totalUser7Day}`}
                    />
                    </div>
                </div>
            </div>
            <div className="mt-6">
                <TopProducts products={topProducts}/>
            </div> 
            <NewUserList users={newUsers}/>
        </div>
    )
}