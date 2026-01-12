import { useEffect, useState } from "react"
import type { ICategory, ICategoryCreate } from "@/types/category"
import categoryApi from "@/services/api/admin/categoryApi"
import CategoryCard from "@/components/admin/category/category-card"
import { EditCategoryDialog } from "@/components/admin/category/edit-category-dialog"
import { DeleteCategoryAlert } from "@/components/admin/category/delete-category-alert"
import { LayoutGrid, Package, PackageSearch, Grid2X2 } from "lucide-react"
import productApi from "@/services/api/admin/productApi"
import PageTitle from "@/components/admin/common/PageTitle"
import { Button } from "@/components/ui/button"
import { CATEGORY_ERROR_MESSAGES } from "@/utils/admin/errorMessages"
import type { AxiosError } from "axios"
import { toast } from "sonner"

export default function CategoriesPage() {
    const [categories, setCategories] = useState<ICategory[]>([])
    const [isLoading, setIsLoading] = useState(true);
    
    //edit category
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

    const [deleteTarget, setDeleteTarget] = useState<ICategory | null>(null);
    const [openDelete, setOpenDelete] = useState(false);

    const [openAdd, setOpenAdd] = useState(false); 

    const [products, setProducts] = useState(0);

    const [addError, setAddError] = useState("");

    const handleEdit = (category : ICategory) => {
        setSelectedCategory(category)
        setOpenEdit(true);
    }
    
    const handleOnSave = (updated : ICategory) => {
        const updatedCategory = updated;
        updateCategory(updatedCategory._id, updatedCategory)
        setOpenEdit(false);
    }

    const handleAdd = (data: ICategory) => {
        const newCategory: ICategoryCreate = {
            name: data.name,
            imageUrl: data.imageUrl,
            description: data.description,
            parentCategory: data.parentCategory ? data.parentCategory._id : null
        }

        createCategory(newCategory);
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

    const createCategory = async (category: ICategoryCreate) => {
        try {
            const res = await categoryApi.create(category);
            loadCategories();

            if(res.data.success === true) {
                setAddError("");
            }

            toast.success("Thêm danh mục thành công");

            setOpenAdd(false);
        }catch (err: unknown) {

            const error = err as AxiosError<{ message: string }>;
            const backendMsg = error.message ?? "";
            const vietnameseMsg =
            CATEGORY_ERROR_MESSAGES[backendMsg] ?? "Có lỗi xảy ra! Vui lòng thử lại.";
            setAddError(vietnameseMsg);
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
    <div className="p-0 md:p-4 bg-white md:bg-transparent">
        {isLoading && (
            <p className="text-gray-500 text-center text-md sm:text-lg">Đang tải dữ liệu...</p>
        )}

        {!isLoading && (
            <div className="flex flex-col gap-3 p-3 shadow-sm bg-white min-h-screen">
                <PageTitle title="Quản lí danh mục" subTitle="Tổ chức và phân loại sản phẩm theo danh mục"/>
                <div className="flex flex-col md:flex-row gap-5 items-center justify-center px-2 md:px-5 py-3">
                    <div className="bg-white border border-gray-200 rounded-md md:flex-col lg:flex-row p-6 shadow-sm transition w-full h-25 md:w-1/3 flex items-center justify-between">
                        <p className="text-md md:text-lg font-semibold">Tổng danh mục</p>
                        <div className="flex flex-row items-center gap-2">
                            <p className="text-md md:text-lg font-bold">{categories.length}</p>
                            <LayoutGrid size={28} color="#146bdb" />
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-md md:flex-col lg:flex-row p-6 shadow-sm transition w-full h-25 md:w-1/3 flex items-center justify-between">
                        <p className="text-md md:text-lg font-semibold">Danh mục cha</p>
                        <div className="flex flex-row items-center gap-2">
                            <p className="text-md md:text-lg font-bold">0</p>
                            <PackageSearch size={28} color="#e1c614" />
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-md md:flex-col lg:flex-row p-6 shadow-sm transition w-full h-25 md:w-1/3 flex items-center justify-between">
                        <p className="text-md md:text-lg font-semibold">Tổng sản phẩm</p>
                         <div className="flex flex-row items-center gap-2">
                            <p className="text-md md:text-lg font-bold">{products}</p>
                            <Package size={28} color="#10b238" />
                        </div>
                    </div>
                </div>
                <div className="border border-gray-200 flex flex-col gap-4 rounded-md px-2 md:px-4 py-4">
                    <div className="flex flex-row items-center justify-between gap-2">
                        <span className="flex flex-row items-center gap-2">
                            <Grid2X2 size={22} color="#146bdb" />
                            <p className="text-lg font-bold">Danh sách danh mục</p>
                        </span>
                        <Button
                            className="w-full max-w-30 bg-[#3385F0] text-white hover:bg-[#2B71CC] text-sm md:text-[0.9rem] rounded-sm"
                            onClick={() => setOpenAdd(true)}
                        >
                            Thêm danh mục
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
                        {categories.map((c) =>(
                            <div key={c._id} className="aspect-square">
                                <CategoryCard
                                    category={c}
                                    onEdit={handleEdit}
                                    onDelete={(category) => {
                                    setDeleteTarget(category);
                                    setOpenDelete(true);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <EditCategoryDialog
                        open={openEdit}
                        setOpen={setOpenEdit}
                        category={selectedCategory}
                        categories={categories}
                        onSave={handleOnSave}
                        formError=""
                        isEddit={true}
                    />
                    <EditCategoryDialog
                        open={openAdd}
                        setOpen={setOpenAdd}
                        category={null}
                        categories={categories}
                        onSave={handleAdd}
                        formError={addError}
                        isEddit={false}
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
