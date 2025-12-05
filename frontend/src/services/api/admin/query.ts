export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  status?: "active" | "inactive" | "out_of_stock";
}
