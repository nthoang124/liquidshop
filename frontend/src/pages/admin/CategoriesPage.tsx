import { useEffect, useState } from "react"
import type { ICategory } from "@/types/category"
import categoryApi from "@/services/api/admin/categoryApi"
import CategoryCard from "@/components/admin/category/category-card"
import { EditCategoryDialog } from "@/components/admin/category/edit-category-dialog"
import { DeleteCategoryAlert } from "@/components/admin/category/delete-category-alert"
import { LayoutGrid, Package, PackageSearch, Grid2X2 } from "lucide-react"
import productApi from "@/services/api/admin/productApi"

export default function CategoriesPage() {
    const [categories, setCategories] = useState<ICategory[]>([])
    const [isLoading, setIsLoading] = useState(true);
    
    //edit category
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

    const [deleteTarget, setDeleteTarget] = useState<ICategory | null>(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [products, setProducts] = useState(0);

    const handleEdit = (category : ICategory) => {
        setSelectedCategory(category)
        setOpenEdit(true);
    }
    
    const handleOnSave = (updated : ICategory) => {
        const updatedCategory = updated;
        updateCategory(updatedCategory._id, updatedCategory)
    }

    const loadProductsCount = async () => {
        try {
            const res = await productApi.getAll();
            setProducts(res.data.count);
        }catch(error){
            console.log(error);
        }
    }

    const loadCategories = async () => {
        try {
            const res = await categoryApi.getAll();
            setCategories(res.data.data);
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
            await categoryApi.update(id, category)
            loadCategories();
        }catch(err){
            console.log(err);
        }
    }

    const confirmDelete = async () => {
        try {
            if(!deleteTarget) return;

            await categoryApi.delete(deleteTarget._id);
            loadCategories();
        }catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await loadCategories();
            await loadProductsCount();
        }
        fetchData();
    },[]);
    
  return (
    <div className="p-5">
        {isLoading && (
            <p className="text-gray-500 text-center text-md sm:text-lg">Đang tải dữ liệu...</p>
        )}

        {!isLoading && categories.length === 0 && (
            <p className="text-gray-500 text-center text-md sm:text-lg">Chưa có dữ liệu</p>
        )}

        {!isLoading && categories.length > 0 && (
            <div className="flex flex-col gap-3 p-4 shadow-sm bg-white ">
                <div className="flex flex-col mt-4 px-8 gap-3 border-b border-gray-300 pb-3">
                    <p className="text-2xl lg:text-3xl font-bold">Quản lí danh mục</p>
                    <p className="text-md md:text-lg text-gray-600">Tổ chức và phân loại sản phẩm theo danh mục</p>
                </div>
                <div className="flex flex-col md:flex-row gap-5 items-center justify-center px-8 py-3">
                    <div className="bg-white border border-gray-200 rounded-xl md:flex-col lg:flex-row p-6 shadow-sm hover:shadow-md transition w-full md:w-1/3 flex items-center justify-between">
                        <p className="text-lg font-semibold">Tổng danh mục</p>
                        <div className="flex flex-row items-center gap-2">
                            <p className="text-xl lg:text-2xl font-bold">{categories.length}</p>
                            <LayoutGrid size={32} color="#146bdb" />
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl md:flex-col lg:flex-row p-6 shadow-sm hover:shadow-md transition w-full md:w-1/3 flex items-center justify-between">
                        <p className="text-lg font-semibold">Danh mục cha</p>
                        <div className="flex flex-row items-center gap-2">
                            <p className="text-xl lg:text-2xl font-bold">0</p>
                            <PackageSearch size={32} color="#e1c614" />
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl md:flex-col lg:flex-row p-6 shadow-sm hover:shadow-md transition w-full md:w-1/3 flex items-center justify-between">
                        <p className="text-lg font-semibold">Tổng sản phẩm</p>
                         <div className="flex flex-row items-center gap-2">
                            <p className="text-xl lg:text-2xl font-bold">{products}</p>
                            <Package size={32} color="#10b238" />
                        </div>
                    </div>
                </div>
                <div className="border border-gray-200 flex flex-col gap-4 rounded-md px-4 lg:px-4 xl:px-10 py-4">
                    <div className="flex flex-row gap-2">
                        <Grid2X2 size={22} color="#146bdb" />
                        <p className="text-lg font-bold">Danh sách danh mục</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"  >
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
            </div>
        )}
        
    </div>
  )
}
