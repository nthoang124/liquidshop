import axiosClient from "./axiosClient";

export const wishlistService = {
  getWishlist: () => {
    return axiosClient.get("/wishlist");
  },

  addToWishlist: (productId: string) => {
    return axiosClient.post(`/wishlist/${productId}`);
  },

  removeFromWishlist: (productId: string) => {
    return axiosClient.delete(`/wishlist/${productId}`);
  },
};
