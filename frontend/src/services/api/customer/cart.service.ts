// services/api/customer/cart.service.ts
import axiosClient from "./axiosClient";

export const cartService = {
  getCart: async () => {
    return axiosClient.get("/cart");
  },

  addToCart: async (productId: string, quantity: number) => {
    return axiosClient.post("/cart/add", { productId, quantity });
  },

  updateCartItem: async (productId: string, quantity: number) => {
    return axiosClient.put("/cart/update", { productId, quantity });
  },

  removeCartItem: async (productId: string) => {
    return axiosClient.post("/cart/remove", { productId });
  },
};
