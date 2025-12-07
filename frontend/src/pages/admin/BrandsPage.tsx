import BrandCard from "@/components/admin/brands/brand-card";
import type{ IBrand } from "@/types/brand";
import { useEffect, useState } from "react";
import brandApi from "@/services/api/admin/brandApi";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EditBrandDialog } from "@/components/admin/brands/edit-brand-dialog";
import { DeleteBrandAlert } from "@/components/admin/brands/delete-brand-alert";

export default function BrandsPage() {
    const [brands, setBrands] = useState<IBrand[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<IBrand | null>(null);

    const [deleteTarget, setDeleteTarget] = useState<IBrand | null>(null);
    const [openDelete, setOpenDelete] = useState(false);

     const handleEdit = (brand: IBrand) => {
        console.log("Edit brand:", brand)
        // mở dialog edit, set selectedBrand,...
        setSelectedBrand(brand)
        setOpenEdit(true)
    }

    const handleOnSave = (update: IBrand) => {
        const updatedBrand = update;
        console.log("check updated brand: ", updatedBrand);
        updateBrand(updatedBrand._id, updatedBrand);
    }

    const loadbrands = async () => {
        try {
            const res = await brandApi.getAll();
            setBrands(res.data.data);
        }
        catch(error){
            console.log(error);
        }
        finally {
            setIsLoading(false);
        }
    };

    const updateBrand = async (id: string, data: IBrand) => {
        try {
            const res = await brandApi.update(id, data);
            console.log("check update: ", res.data);
        }catch(error) {
            console.log(error);
        }
    }

    const confirmDelete = async () => {
        try {
            if(!deleteTarget) return;
            console.log(deleteTarget._id)
            // const res = await brandApi.delete(deleteTarget._id);
            // console.log("check delete api: ", res.message);
            loadbrands();
        }catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        try {
            const fetchData = async () => {
                await loadbrands();
            }
            fetchData();
        }catch(error){
            console.log(error);
        }
    })

  return (
    <div className="p-4">
            {isLoading && (
                <p className="text-gray-500 text-center text-md sm:text-lg">Đang tải dữ liệu...</p>
            )}
    
            {!isLoading && brands.length === 0 && (
                <p className="text-gray-500 text-center text-md sm:text-lg">Chưa có dữ liệu</p>
            )}
    
            {!isLoading && brands.length > 0 && (
                <div className="flex flex-col gap-3">
                    <p className="text-xl lg:text-2xl font-bold text-gray-600">Danh sách các loại sản phẩm</p>
                    <Button className="w-full max-w-25 bg-blue-500 font-bold text-md md:text-lg hover:bg-blue-600">
                        <Plus size={32} color="#fcf7f7" strokeWidth={3} />
                        Thêm
                    </Button>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:px-4 xl:px-10 gap-5 mt-4"  >
                        {brands.map((b) =>(
                            <BrandCard 
                                key={b._id} 
                                brand={b} 
                                onEdit={handleEdit}
                                onDelete={(brand) => {
                                    setDeleteTarget(brand);
                                    setOpenDelete(true);
                                }}
                            />
                        ))}
                    </div>
                    <EditBrandDialog
                        open={openEdit}
                        setOpen={setOpenEdit}
                        brand={selectedBrand}
                        onSave={handleOnSave}
                    />
                    <DeleteBrandAlert
                        open={openDelete}
                        setOpen={setOpenDelete}
                        brandName={deleteTarget?.name}
                        onConfirm={confirmDelete}
                    /> 
                </div>  
            )}
        </div>
  )
}
