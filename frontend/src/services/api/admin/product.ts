interface ICategory {
  _id: string;
  name: string;
}

interface IBrand {
  _id: string;
  name: string;
}

export interface IProduct {
  _id: string;
  name: string;
  sku: string;
  description?: string;
  detailedInfo?: string;
  price: number;
  originalPrice?: number | null;
  stockQuantity: number;
  images: string[];
  category: ICategory;
  brand: IBrand | null;
  specifications: Record<string, string>;
  status: "active" | "inactive" | "out_of_stock";
  tags: string[];
  averageRating: number;
  reviewCount: number;
  soldCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IProductListResponse {
  success: boolean;
  count: number;
  page: number;
  totalPages: number;
  data: IProduct[];
}
