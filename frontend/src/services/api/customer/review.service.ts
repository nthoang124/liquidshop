import axiosClient from "./axiosClient";

export const reviewService = {
  getReviewsByProduct: async (productId: string) => {
    return axiosClient.get(`/review/${productId}`);
  },
  createReview: async (data: {
    productId: string;
    rating: number;
    comment: string;
  }) => {
    return axiosClient.post(`/review`, data);
  },
};
