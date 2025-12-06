import { useEffect, useState } from "react"
import type { ICategory } from "@/types/category"
import categoryApi from "@/services/api/admin/categoryApi"
import CategoryCard from "@/components/admin/category/category-card"
import { EditCategoryDialog } from "@/components/admin/category/edit-category-dialog"

export default function CategoriesPage() {
    const [categories, setCategories] = useState<ICategory[]>([])
    const [isLoading, setIsLoading] = useState(true);
    
    //edit category
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

    const handleEdit = (category : ICategory) => {
        setSelectedCategory(category)
        setOpenEdit(true);
    }

    const handleOnSave = () => {

    }
    
    const loadCategoris = async () => {
        try {
            const res = await categoryApi.getAll();
            console.log("check imgurl: ", res.data[0].imageUrl);
            setCategories(res.data);
        }
        catch(err){
            console.log(err);
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await loadCategoris();
        }
        fetchData();
    },[]);
  return (
    <div className="p-4">
        {isLoading && (
            <p className="text-gray-500 text-center text-md sm:text-lg">Đang tải dữ liệu...</p>
        )}

        {!isLoading && categories.length === 0 && (
            <p className="text-gray-500 text-center text-md sm:text-lg">Chưa có dữ liệu</p>
        )}

        {!isLoading && categories.length > 0 && (
            <div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                    {categories.map((c) =>(
                        <CategoryCard 
                            key={c._id} 
                            category={c} 
                            handleEdit={handleEdit}
                        />
                    ))}
                </div>
                <EditCategoryDialog
                    open={openEdit}
                    setOpen={setOpenEdit}
                    category={selectedCategory}
                    onSave={handleOnSave}
                />
            </div>
        )}
        
    </div>
  )
}
