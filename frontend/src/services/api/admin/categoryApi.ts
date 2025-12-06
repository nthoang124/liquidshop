import axiosClient from "../anxiosCient";
import type { ICategory, ICategoryCreate, ICategoryListRespose } from "@/types/category";

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
    }, 

    create(data: Partial<ICategoryCreate>) : Promise<{success: boolean; message: string; data: ICategory}> {
        return axiosClient.post("/admin/category/createCategory", data);
    }

}

export default categoryApi

