// services/api/customer/promotion.service.ts
import axiosClient from "./axiosClient";

export const promotionService = {
  // Kiểm tra mã giảm giá (GET /promotion/:code)
  checkPromotion: async (code: string) => {
    return axiosClient.get(`/promotion/${code}`);
  },
};
