export interface IAddress {
  street?: string;
  ward?: string;
  district?: string;
  city?: string;
  isDefault?: boolean;
}

export interface IUser {
  _id: string;
  email: string;
  password?: string;
  fullName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  addresses?: IAddress[];

  role: "customer" | "admin";
  isActive: boolean;

  passwordResetToken?: string;
  passwordResetExpires?: string;

  createdAt: string;
  updatedAt: string;
}

export interface IUserListResponse {
  success: boolean;
  count: number;
  page: number;
  totalPages: number;
  data: IUser[];
}

export interface IUserLoginResponse {
  id:  string;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
}
