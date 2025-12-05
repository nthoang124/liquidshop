import axiosClient from "../anxiosCient";
import type { IProductListResponse, IProduct } from "@/services/api/admin/product";
import type { ProductQuery } from "./query";

const productApi = {
  getAll(params?: ProductQuery): Promise<IProductListResponse> {
    return axiosClient.get("/product/getAllProducts", { params });
  },

  getById(id: string): Promise<{ success: boolean; data: IProduct }> {
    return axiosClient.get(`/products/${id}`);
  },
};

export default productApi;
