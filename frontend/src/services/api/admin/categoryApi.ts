import axiosClient from "../anxiosCient";
import type { ICategory, ICategoryListRespose } from "@/types/category";

const categoryApi = {
    getAll(): Promise<ICategoryListRespose> {
        return axiosClient.get("/admin/category/getAllCategories", )
    },

    update(id: string, data: Partial<ICategory>): 
        Promise<{ success: boolean; message: string; data: ICategory }> {
            return axiosClient.put(`/admin/category/${id}`, data);
    },

    delete(id: string): Promise<{success: boolean; message: string }> {
        return axiosClient.delete(`/admin/category/${id}`);
    }
}

export default categoryApi

