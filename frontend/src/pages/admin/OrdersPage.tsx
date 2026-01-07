import PageTitle from "@/components/admin/common/PageTitle";
import OrderDetailDialog from "@/components/admin/orders/OrderDetailDialog";
import { OrdersTable } from "@/components/admin/orders/orders-table";
import orderApi from "@/services/api/admin/orderApi";
import type { OrderQuery } from "@/services/api/admin/query";
import type { IOrder } from "@/types/order";
import { Grid2X2 } from "lucide-react";
import { useEffect, useState } from "react"

export default function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const perPage = 5;
  const [totalOrders, setTotalOrders] = useState(0);
  const [detailedOrder, setDetailedOrder] = useState<IOrder | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [orderStatusSelected, setOrderStatusSelected] = useState("all");
  const [paymentStatusSelected, setPaymentStatusSelected] = useState("all");

  const handleDetailOpen = (order: IOrder) => {
    try {
      setDetailedOrder(order);
      setDetailOpen(true);
    }catch(error){
      console.log(error);
    }
  }

  const onChangeOrderStatus = async (status: string, id: string) => {
    try {
      await orderApi.updateStatus(id, status);
      await loadOrders();
    } catch (error) {
      console.log(error);
    } 
  };

  const loadOrders = async () => {
    try {
      const params: OrderQuery = {
        limit: perPage,
        page,
        search,
      }

      if(orderStatusSelected !== "all") params.orderStatus = orderStatusSelected;
      if(paymentStatusSelected !== "all") params.paymentStatus = paymentStatusSelected;

      const res = await orderApi.getAll(params);
      setOrders(res.data.data);
      setTotalOrders(res.data.count);
      setTotalPages(res.data.totalPages);
    }catch(error){
      console.log(error);
    }finally{
      setIsLoading(false);
    }
  }

  useEffect(() => {
    try {
      const fetchData = async () => {
        await loadOrders();
      }
      fetchData()
    }catch(error){
      console.log(error);
    }
  },[page, paymentStatusSelected, orderStatusSelected])

  useEffect(() => {
    const timeOut = setTimeout(() => {
      loadOrders();
    }, 500)

    return () => clearTimeout(timeOut);
  }, [search])

  useEffect(() => {
    setPage(1);
  }, [search, paymentStatusSelected, orderStatusSelected]);

  return (
     <div className="p-0 md:p-4 bg-white md:bg-transparent">
      {isLoading && (
          <p className="text-gray-500 text-center text-md sm:text-lg">Đang tải dữ liệu...</p>
      )}
      <div className="flex flex-col bg-white gap-3 p-0 sm:p-2 md:p-3">
          <PageTitle title="Quản lí đơn hàng" subTitle="Theo dõi và xử lí đơn hàng"/>
          <div className="border border-gray-200 p-3 shadow-lg rounded-lg mt-10">
              <p className="flex flex-row gap-2 items-center font-bold text-base">
                  <Grid2X2 size={24} color="#3f6cf3"/>
                  Tổng đơn hàng: {totalOrders}
              </p>
              <OrdersTable
                orders={orders}
                setPage={setPage}
                totalPages={totalPages}
                page={page}
                search={search}
                setSearch={setSearch}
                handleDetailOpen={handleDetailOpen}
                onChangeOrderStatus={onChangeOrderStatus}
                orderStatusSelected={orderStatusSelected}
                setOrderStatusSelected={setOrderStatusSelected}
                paymentSatusSelected={paymentStatusSelected}
                setPaymentStatusSelected={setPaymentStatusSelected}
              />
              <OrderDetailDialog
                open={detailOpen}
                setOpen={setDetailOpen}
                order={detailedOrder}
              />
          </div>
      </div>
        
    </div>
  )
}
