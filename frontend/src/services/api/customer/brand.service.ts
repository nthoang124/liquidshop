import axiosClient from "@/services/api/customer/axiosClient";
import type { IBrand, IBrandListResponse } from "@/types/brand";

export const brandService = {
  getAllBrands: async () => {
    return axiosClient.get<any, IBrandListResponse>("/brand/getAllBrands");
  },

  getBrandsByCategory: async (categoryId: string) => {
    return axiosClient.get<any, { message: string; brands: IBrand[] }>(
      `/brand/${categoryId}`
    );
  },
};
