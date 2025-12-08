import BrandCard from "@/components/admin/brands/brand-card";
import type{ IBrand } from "@/types/brand";
import { useEffect, useState } from "react";
import brandApi from "@/services/api/admin/brandApi";
import { Button } from "@/components/ui/button";
import { Crown, Globe, Grid2X2, Plus } from "lucide-react";
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
    <div className="p-5">
            {isLoading && (
                <p className="text-gray-500 text-center text-md sm:text-lg">Đang tải dữ liệu...</p>
            )}
    
            {!isLoading && brands.length === 0 && (
                <p className="text-gray-500 text-center text-md sm:text-lg">Chưa có dữ liệu</p>
            )}
    
            {!isLoading && brands.length > 0 && (
                <div className="flex flex-col gap-3 p-4 shadow-sm bg-white">
                    <div className="flex flex-col bg-white mt-4 px-8 gap-3 border-b border-gray-300 pb-3 pt-3">
                        <p className="text-2xl lg:text-3xl font-bold">Quản lí thương hiệu</p>
                        <p className="text-md md:text-lg text-gray-600">Quản lí thương hiệu và nhà cung cấp sản phẩm</p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-5 items-center justify-center px-8 py-3">
                        <div className="bg-white border border-gray-200 rounded-xl md:flex-col lg:flex-row p-6 shadow-sm hover:shadow-md transition w-full md:w-1/3 flex items-center justify-between">
                            <p className="text-lg font-semibold">Tổng thương hiệu</p>
                            <div className="flex flex-row items-center gap-2">
                                <p className="text-xl lg:text-2xl font-bold">{brands.length}</p>
                                <Crown size={32} color="#e0e411" />
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-xl md:flex-col lg:flex-row p-6 shadow-sm hover:shadow-md transition w-full md:w-1/3 flex items-center justify-between">
                            <p className="text-lg font-semibold">Đang hoạt động</p>
                            <div className="flex flex-row items-center gap-2">
                                <p className="text-xl lg:text-2xl font-bold">{brands.length}</p>
                                <Globe size={32} color="#40c408" />
                            </div>
                        </div>

                    </div>
                    
                    <div className=" flex flex-col border border-gray-200 p-4 mx-4 rounded-md">
                        <div className="flex flex-row justify-between items-center px-4">
                            <div className="flex flex-row gap-2">
                               <Grid2X2 size={22} color="#146bdb"/> 
                               <p className="font-bold text-base">Danh sách thương hiệu</p>
                            </div>
                            <Button className="w-full max-w-25 bg-blue-500 font-bold text-md md:text-lg hover:bg-blue-600">
                                <Plus size={32} color="#fcf7f7" strokeWidth={3} />
                                Thêm
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:px-8 gap-5 mt-4"  >
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
                </div>
            )}
        </div>
  )
}
