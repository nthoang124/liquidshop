import axiosClient from "./anxiosCient";
import type { IProductListResponse, IProduct } from "@/services/api/admin/product";
import type { IProductCreate, IProductUpdate, ProductQuery } from "./query";

const productApi = {
  getAll(params?: ProductQuery) {
    return axiosClient.get<IProductListResponse>("/admin/product/getAllProducts", { params });
  },

  getById(id: string) {
    return axiosClient.get<{ success: boolean; data: IProduct }>(`/admin/product/${id}`);
  },

  update(id: string, data: IProductUpdate) {
    return axiosClient.put<{success: boolean; message: string; data: IProductUpdate}>(`admin/product/${id}`, data);
  },

  create(data: IProductCreate) {
    return axiosClient.post<{success: boolean; message: string; data: IProductCreate}>("admin/product/createProduct", data);
  },
  
  delete(id: string) {
    return axiosClient.delete<{success: boolean; message: string}>(`admin/product/${id}`)
  }
};

export default productApi;
