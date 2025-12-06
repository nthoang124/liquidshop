import { useEffect, useState } from "react"
import type { ICategory } from "@/types/category"
import categoryApi from "@/services/api/admin/categoryApi"
import CategoryCard from "@/components/admin/category/category-card"
import { EditCategoryDialog } from "@/components/admin/category/edit-category-dialog"
import { DeleteCategoryAlert } from "@/components/admin/category/delete-category-alert"

export default function CategoriesPage() {
    const [categories, setCategories] = useState<ICategory[]>([])
    const [isLoading, setIsLoading] = useState(true);
    
    //edit category
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

    const [deleteTarget, setDeleteTarget] = useState<ICategory | null>(null);
    const [openDelete, setOpenDelete] = useState(false);

    const handleEdit = (category : ICategory) => {
        setSelectedCategory(category)
        setOpenEdit(true);
    }
    
    const handleOnSave = (updated : ICategory) => {
        const updatedCategory = updated;
        updateCategory(updatedCategory._id, updatedCategory)
    }

    const loadCategories = async () => {
        try {
            const res = await categoryApi.getAll();
            setCategories(res.data);
        }
        catch(err){
            console.log(err);
        }
        finally {
            setIsLoading(false);
        }
    };

    const updateCategory = async (id : string, category : ICategory) => {
        try {
            const res = await categoryApi.update(id, category)
            console.log("check update api: ", res.message, res.data);
            loadCategories();
        }catch(err){
            console.log(err);
        }
    }

    const confirmDelete = async () => {
        try {
            if(!deleteTarget) return;

            const res = await categoryApi.delete(deleteTarget._id);
            console.log("check delete api: ", res.message);
            loadCategories();
        }catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await loadCategories();
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
            <div className="flex flex-col gap-3">
                <p className="text-2xl lg:text-3xl font-bold">Danh sách các loại sản phẩm</p>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:px-4 xl:px-10 gap-5 mt-4"  >
                    {categories.map((c) =>(
                        <CategoryCard 
                            key={c._id} 
                            category={c} 
                            handleEdit={handleEdit}
                            onAskDelete={(category) => {
                                setDeleteTarget(category);
                                setOpenDelete(true);
                            }}
                        />
                    ))}
                </div>
                <EditCategoryDialog
                    open={openEdit}
                    setOpen={setOpenEdit}
                    category={selectedCategory}
                    onSave={handleOnSave}
                />
                <DeleteCategoryAlert
                    open={openDelete}
                    setOpen={setOpenDelete}
                    categoryName={deleteTarget?.name}
                    onConfirm={confirmDelete}
                />
            </div>  
        )}
        
    </div>
  )
}
