import { productService } from "@/services/api/customer/product.service";
import { categoryService } from "@/services/api/customer/category.service";
import { brandService } from "@/services/api/customer/brand.service";
import type { IProduct } from "@/types/product";
import type { IBrand } from "@/types/brand";

export interface IHomeSection {
  title: string;
  categoryId: string;
  products: IProduct[];
  brands: IBrand[];
}

const getSectionData = async (
  allCategories: any[],
  keyword: string
): Promise<IHomeSection | null> => {
  const cat = allCategories.find((c) =>
    c.name.toLowerCase().includes(keyword.toLowerCase())
  );

  if (!cat) return null;

  const [productRes, brandRes] = await Promise.all([
    productService.getProducts({
      category: cat.name,
      limit: 10,
      fields:
        "name,price,images,originalPrice,averageRating,specifications,soldCount",
    }),
    brandService.getBrandsByCategory(cat._id),
  ]);

  return {
    title: cat.name,
    categoryId: cat._id,
    products: productRes.data?.products || [],
    brands: brandRes.brands || [],
  };
};

export const homeLoader = async () => {
  const categoryRes = await categoryService.getAllCategories();
  const allCategories = categoryRes.data || [];

  const [laptop, pc, keyboard, mouse, monitor] = await Promise.all([
    getSectionData(allCategories, "Laptop Gaming"),
    getSectionData(allCategories, "PC Gaming"),
    getSectionData(allCategories, "Bàn phím"),
    getSectionData(allCategories, "Chuột"),
    getSectionData(allCategories, "Màn hình"),
  ]);

  return { laptop, pc, keyboard, mouse, monitor };
};
