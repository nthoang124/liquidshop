import axiosClient from "./anxiosCient";
import type { ICategory, ICategoryCreate, ICategoryListRespose } from "@/types/category";

const categoryApi = {
    getAll() {
        return axiosClient.get<ICategoryListRespose>("/admin/category/getAllCategories");
    },

    update(id: string, data: Partial<ICategory>) {
        return axiosClient.put<{ success: boolean; message: string; data: ICategory }>(
            `/admin/category/${id}`,
            data
        );
    },

    delete(id: string) {
        return axiosClient.delete<{ success: boolean; message: string }>(
            `/admin/category/${id}`
        );
    },

    create(data: Partial<ICategoryCreate>) {
        return axiosClient.post<{ success: boolean; message: string; data: ICategory }>(
            "/admin/category/createCategory",
            data
        );
    },
};

export default categoryApi;
