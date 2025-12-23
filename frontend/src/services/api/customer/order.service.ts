// services/api/customer/order.service.ts
import axiosClient from "./axiosClient";
import type { ICreateOrderPayload, ICreateOrderResponse } from "@/types/order";

export const orderService = {
  // Tạo đơn hàng (POST /order)
  createOrder: async (
    data: ICreateOrderPayload
  ): Promise<ICreateOrderResponse> => {
    return axiosClient.post("/order", data);
  },

  // Lấy đơn hàng theo mã (GET /order/:code)
  getOrderByCode: async (code: string) => {
    return axiosClient.get(`/order/${code}`);
  },

  // Lấy danh sách đơn hàng của user (GET /order)
  getMyOrders: async () => {
    return axiosClient.get("/order");
  },

  createPaymentUrl: async (data: {
    orderCode: string;
    paymentMethod: string;
    paymentProvider?: string;
  }) => {
    return axiosClient.post("/payment", data);
  },

  cancelOrder: async (orderCode: string) => {
    return axiosClient.post(`/order/${orderCode}`);
  },
};
