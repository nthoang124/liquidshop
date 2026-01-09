import axiosClient from "@/services/api/customer/axiosClient";
import { type ICategory, type ICategoryListRespose } from "@/types/category";

export const categoryService = {
  getAllCategories: async () => {
    return axiosClient.get<any, ICategoryListRespose>(
      "/category/getAllCategories"
    );
  },

  getCategoryById: async (id: string) => {
    return axiosClient.get<any, { success: boolean; data: ICategory }>(
      `/category/${id}`
    );
  },

  getSpecsByCategoryId: async (id: string) => {
    return axiosClient.get<
      any,
      { success: boolean; data: Record<string, string[]> }
    >(`/category/specs/${id}`);
  },
};
