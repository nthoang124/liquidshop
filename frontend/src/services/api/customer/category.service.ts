import axiosClient from "@/services/api/customer/axiosClient";
import { type ICategory, type ICategoryListRespose } from "@/types/category";

export const categoryService = {
  getAllCategories: async () => {
    return axiosClient.get<any, ICategoryListRespose>(
      "/category/getAllCategories"
    );
  },

  // Lấy chi tiết
  getCategoryById: async (id: string) => {
    return axiosClient.get<any, { success: boolean; data: ICategory }>(
      `/category/${id}`
    );
  },
};
