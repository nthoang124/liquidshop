// src/context/CustomerAuthContext.tsx
import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useEffect,
} from "react";
import { jwtDecode } from "jwt-decode";
import { type IUser } from "@/types/user";
import { authService } from "@/services/api/customer/auth.service";

export type AuthUser = IUser;

interface TokenPayload {
  id: string;
  role: string;
  exp: number;
}

interface AuthResult {
  success: boolean;
  message?: string;
}

interface LoginData {
  email: string;
  password: string;
  remember?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<AuthResult>;
  registerAuth: (data: any) => Promise<AuthResult>;
  logout: () => void;
  updateUser: (data: Partial<IUser>) => Promise<AuthResult>;
  changePassword: (
    oldPassword: string,
    newPassword: string
  ) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // --- Khởi tạo: Kiểm tra token ở cả 2 nơi khi load trang ---
  useEffect(() => {
    const initAuth = async () => {
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
      const storedUser =
        localStorage.getItem("user") || sessionStorage.getItem("user");

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          const latestUser = await authService.getMe();
          setUser(latestUser);

          if (localStorage.getItem("accessToken")) {
            localStorage.setItem("user", JSON.stringify(latestUser));
          } else {
            sessionStorage.setItem("user", JSON.stringify(latestUser));
          }
        } catch (error) {
          console.error("Auth initialization failed:", error);
          window.location.href = "/auth/login/customer";
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  // --- ĐĂNG NHẬP ---
  const login = async (input: LoginData): Promise<AuthResult> => {
    try {
      const response: any = await authService.login({
        email: input.email,
        password: input.password,
      });

      if (response.token) {
        const storage = input.remember ? localStorage : sessionStorage;
        storage.setItem("accessToken", response.token);

        try {
          const userDetail = await authService.getMe();
          setUser(userDetail);
          storage.setItem("user", JSON.stringify(userDetail));

          return { success: true, message: "Đăng nhập thành công" };
        } catch (infoError) {
          const decoded = jwtDecode<TokenPayload>(response.token);
          const fallbackUser: AuthUser = {
            _id: decoded.id,
            email: input.email,
            role: decoded.role as any,
            fullName: "Người dùng",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            addresses: [],
          };
          setUser(fallbackUser);
          storage.setItem("user", JSON.stringify(fallbackUser));
          return { success: true, message: "Đăng nhập thành công" };
        }
      }

      return {
        success: false,
        message: response.message || "Đăng nhập thất bại",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Lỗi kết nối máy chủ",
      };
    }
  };

  // --- ĐĂNG KÝ ---
  const registerAuth = async (data: any): Promise<AuthResult> => {
    try {
      const response: any = await authService.register(data);
      if (response.user || response.message) {
        return { success: true, message: "Đăng ký thành công!" };
      }
      return { success: false, message: "Đăng ký thất bại" };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Lỗi đăng ký",
      };
    }
  };

  // --- ĐĂNG XUẤT ---
  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");
    window.location.href = "/auth/login/customer";
  };

  // --- CẬP NHẬT THÔNG TIN ---
  const updateUser = async (data: Partial<IUser>): Promise<AuthResult> => {
    try {
      const res: any = await authService.updateProfile(data);
      const updatedUser = res.user || res;

      setUser(updatedUser);

      // Cập nhật vào đúng bộ nhớ đang dùng
      if (localStorage.getItem("accessToken")) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
      }

      return { success: true, message: "Cập nhật thành công" };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Lỗi cập nhật",
      };
    }
  };

  // --- ĐỔI MẬT KHẨU ---
  const changePassword = async (
    oldPassword: string,
    newPassword: string
  ): Promise<AuthResult> => {
    try {
      await authService.changePassword({
        password: oldPassword,
        new_password: newPassword,
      });
      return { success: true, message: "Đổi mật khẩu thành công" };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Lỗi đổi mật khẩu",
      };
    }
  };

  const value = {
    user,
    isLoading,
    login,
    registerAuth,
    logout,
    updateUser,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
