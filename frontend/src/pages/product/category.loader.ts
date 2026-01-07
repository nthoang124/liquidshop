import { categoryService } from "@/services/api/customer/category.service";
import { productService } from "@/services/api/customer/product.service";

export const categoryDetailLoader = async ({ params, request }: any) => {
  const { id } = params;
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const page = Number(searchParams.get("page")) || 1;
  const sortOption = searchParams.get("sort") || "-createdAt";

  const apiParams: any = {
    category: "",
    page: page,
    limit: 20,
    sort: sortOption,
  };

  searchParams.forEach((value, key) => {
    if (!["page", "sort"].includes(key)) {
      apiParams[key] = value;
    }
  });

  try {
    const catRes = await categoryService.getCategoryById(id as string);
    const categoryDetail = catRes.data;

    if (categoryDetail) {
      apiParams.category = categoryDetail.name;
      const productRes = await productService.getProducts(apiParams);

      return {
        categoryDetail,
        productResponse: productRes,
      };
    }
    return { categoryDetail: null, productResponse: null };
  } catch (error) {
    return { categoryDetail: null, productResponse: null };
  }
};
