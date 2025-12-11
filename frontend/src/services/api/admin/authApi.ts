import axiosClient from "./anxiosCient"

const authApi = {
    login(email: string, password: string) {
        return axiosClient.post<{message: string; token: string}>("/auth/login/admin", {email, password});
    },

}

export default authApi