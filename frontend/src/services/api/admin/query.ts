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

// export interface ProductQuery {
//   page?: number;
//   limit?:number;
//   Search?: string | null;
//   category?: string | null;
//   brand?: string | null;
//   status?: "active" | "inactive" | "out_of_stock";
// }