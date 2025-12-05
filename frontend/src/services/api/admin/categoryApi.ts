import axiosClient from "../anxiosCient";
import type { ICategory, ICategoryListRespose } from "@/types/category";

const categoryApi = {
    getAll(): Promise<ICategoryListRespose> {
        return axiosClient.get("/admin/category/getAllCategories", )
    }
}

export default categoryApi

