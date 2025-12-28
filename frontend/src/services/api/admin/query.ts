export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string | null;
  category?: string | null;
  brand?: string | null;
  status?: "active" | "inactive" | "out_of_stock" | string| null;
}

export interface UserQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface IProductUpdate {
  name: string;
  sku: string;
  description?: string;
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  category: string;   
  brand: string;     
  status: string;
  images: string[];
  specifications: Record<string, string>;
}

export interface IProductCreate {
  name: string;
  sku: string;
  description?: string;
  detailedInfo: string;
  price: number
  originalPrice?: number;
  stockQuantity: number;
  images: string[];
  category: string;
  brand: string;
  specifications: Record<string, string>;
  status: string;
  tags: string[];
}

export interface OrderQuery {
  page?: number; 
  limit?: number;
  orderStatus?: string;
  paymentStatus?:string;
  paymentMethod?: "COD" | "BankTransfer" | "OnlineGateway";
  userId?: string;
  search?: string;
  sortBy?: "createdAt" | "totalAmount" | "orderCode";
  sortOrder?: "asc" | "desc";
}

export interface IReviewQuery {
  page?: number;
  rating?: number | null;
  status?: string;
  limit?: number;
  search?: string;
}

export interface PromotionQuery {
  page?: number;
  limit?: number;
  isActive?: boolean;
}
