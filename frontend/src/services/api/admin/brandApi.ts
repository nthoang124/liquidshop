import type { IBrand, IBrandListResponse } from '@/types/brand';
import axiosClient from './anxiosCient';

const brandApi = {
    getAll() {
        return axiosClient.get<IBrandListResponse>("/admin/brand/getAllBrands");
    },

    update(id: string, data: Partial<IBrand>) {
        return axiosClient.put<{ success: boolean; message: string; data: IBrand }>(
            `/admin/brand/${id}`,
            data
        );
    },

    delete(id: string) {
        return axiosClient.delete<{ success: boolean; message: string }>(
            `/admin/brand/${id}`
        );
    },

    create(data: IBrand) {
        return axiosClient.post<{success: boolean; message: string}>(
            "/admin/brand/createBrand", data
        );
    }
};

export default brandApi;
