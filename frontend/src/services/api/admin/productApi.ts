import axiosClient from "../anxiosCient";
import type { IProductListResponse, IProduct } from "@/services/api/admin/product";
import type { ProductQuery } from "./query";

const productApi = {
  getAll(params?: ProductQuery) {
    return axiosClient.get<IProductListResponse>("/admin/product/getAllProducts", { params });
  },

  getById(id: string) {
    return axiosClient.get<{ success: boolean; data: IProduct }>(`/admin/products/${id}`);
  },
};

export default productApi;
