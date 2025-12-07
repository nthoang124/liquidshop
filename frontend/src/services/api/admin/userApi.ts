import axiosClient from '../anxiosCient';
import type { IUserListResponse } from '@/types/user';
import type { UserQuery } from "./query"
import type { IUser } from '@/types/user';

const userApi = {
    getAllUsers(params?: UserQuery): Promise<IUserListResponse> {
        return axiosClient.get("admin/user/getAllUsers", {params})
    },
    getById(id: string): Promise<{success: boolean, data: IUser}> {
        return axiosClient.get(`admin/user/${id}`)
    },

    updateRole(id: string, role: string): Promise<{success: boolean; message: string; data:IUser}> {
        return axiosClient.put(`admin/user/${id}`, role)
    }
}

export default userApi