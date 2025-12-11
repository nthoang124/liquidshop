import axiosClient from "./anxiosCient";
import type { IUserListResponse, IUser } from "@/types/user";
import type { UserQuery } from "./query";

const userApi = {
  getAll(params?: UserQuery) {
    return axiosClient.get<IUserListResponse>("admin/user/getAllUsers", { params });
  },

  getById(id: string) {
    return axiosClient.get<{ success: boolean; data: IUser }>(`admin/user/${id}`);
  },

  updateRole(id: string, role: string) {
    return axiosClient.put<{ success: boolean; message: string; data: IUser }>(
      `admin/user/${id}`,
      {role}
    );
  },
};

export default userApi;
