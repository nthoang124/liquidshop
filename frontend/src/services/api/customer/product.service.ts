import axiosClient from "@/services/api/customer/axiosClient";
import type { IProductListResponse, IProduct } from "@/types/product";

interface IProductFilterParams {
  category?: string;
  brand?: string;
  keyword?: string;
  sort?: string;
  page?: number;
  limit?: number;
  fields?: string;
  tags?: string;
  [key: string]: any;
}

export const productService = {
  getProducts: async (
    params: IProductFilterParams
  ): Promise<IProductListResponse> => {
    // Gọi API: GET /products
    // Generic <any, IProductListResponse>: axiosClient sẽ trả về đúng type response này
    return axiosClient.get<any, IProductListResponse>("/products", {
      params: params,
    });
  },

  getProductDetail: async (id: string): Promise<IProduct | null> => {
    const response = await axiosClient.get<any, IProductListResponse>(
      "/products",
      {
        params: { _id: id },
      }
    );
    return response.data.products[0] || null;
  },
};
