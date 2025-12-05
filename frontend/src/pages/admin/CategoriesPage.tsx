import { useEffect, useState } from "react"
import type { ICategory } from "@/types/category"
import categoryApi from "@/services/api/admin/categoryApi"
import CategoryCard from "@/components/admin/category/category-card"

export default function CategoriesPage() {
    const [categories, setCategories] = useState<ICategory[]>([])

    const loadCategoris = async () => {
        try {
            const res = await categoryApi.getAll();

            setCategories(res.data);
        }
        catch(err){
            console.log(err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await loadCategoris();
        }
        fetchData();
    },[]);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 p-3">
        {categories.map((c) =>(
            <CategoryCard key={c.id} category={c}/>
        ))}
    </div>
  )
}
