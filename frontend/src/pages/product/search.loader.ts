import { productService } from "@/services/api/customer/product.service";

export const searchLoader = async ({ request }: any) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const keyword = searchParams.get("keyword") || "";
  const page = Number(searchParams.get("page")) || 1;
  const sortOption = searchParams.get("sort") || "-createdAt";

  const params: any = { page, limit: 20, sort: sortOption, keyword };

  searchParams.forEach((v, k) => {
    if (!["page", "sort", "keyword"].includes(k)) params[k] = v;
  });

  try {
    const res = await productService.getProducts(params);
    return { productResponse: res };
  } catch (err) {
    return { productResponse: null };
  }
};
