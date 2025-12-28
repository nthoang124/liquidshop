import type { PromotionQuery } from './query'
import axiosClient from './axiosClient';
import type { IPromotion, IPromotionListResponse, IPromotionUpdate } from '@/types/promotion'

const promotionApi = {
    getAll(params?: PromotionQuery) {
        return axiosClient.get<IPromotionListResponse>('admin/promotion/getAllPromotions', {params});
    },

    getById(id: string) {
        return axiosClient.get<{success: boolean; data: IPromotion}>(`admin/promotion/${id}`);
    },

    update(id: string, data: IPromotionUpdate) {
        return axiosClient.put<{success: boolean; data: IPromotion }>(`admin/promotion/${id}`, data);
    },

    create(data: IPromotionUpdate) {
        return axiosClient.post<{success: boolean; data: IPromotion}>('admin/promotion/createPromotion', data);
    },

    delete(id: string) {
        return axiosClient.delete<{success:boolean; message: string}>(`admin/promotion/${id}`);
    }
}

export default promotionApi;