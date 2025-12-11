import type { IOrder, IOrderListResponse } from "@/types/order"
import axiosClient from "./anxiosCient"
import type { OrderQuery } from "./query";

const orderApi = {
    getAll(params?: OrderQuery) {
        return axiosClient.get<IOrderListResponse>("admin/order/getAllOrders", {params});
    },
    getByID(id: string) {
        return axiosClient.get<{success: boolean; message: string; data: IOrder}>(`admin/order/${id}`);
    }
}

export default orderApi