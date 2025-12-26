import BrandCard from "@/components/admin/brands/brand-card";
import type{ IBrand } from "@/types/brand";
import { useEffect, useState } from "react";
import brandApi from "@/services/api/admin/brandApi";
import { Button } from "@/components/ui/button";
import { Crown, Globe, Grid2X2, Plus } from "lucide-react";
import { EditBrandDialog } from "@/components/admin/brands/brand-dialog";
import { DeleteBrandAlert } from "@/components/admin/brands/delete-brand-alert";
import type { AxiosError } from "axios";
import { BRAND_ERROR_MESSAGES } from "@/utils/admin/errorMessages";
import PageTitle from "@/components/admin/common/PageTitle";

export default function BrandsPage() {
    const [brands, setBrands] = useState<IBrand[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<IBrand | null>(null);

    const [deleteTarget, setDeleteTarget] = useState<IBrand | null>(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);

    //response message from backend
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");

    const handleEdit = (brand: IBrand) => {
        setSelectedBrand(brand)
        setOpenEdit(true)
    }

    const handleOnSave = (update: IBrand) => {
        const updatedBrand = update;
        updateBrand(updatedBrand._id ?? "", updatedBrand);
        setOpenEdit(false);
    }

    const handleAdd = (update: IBrand) => {
        const newBrand = update;
        createBrand(newBrand);
        // setOpenAdd(false)
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
            await brandApi.update(id, data);
        }catch(error) {
            console.log(error);
        }
    }

    const createBrand = async (data: IBrand) => {
        try {
            const res = await brandApi.create(data);
            setFormError("");
            setFormSuccess(res.data.message);
            setOpenAdd(false);
        }catch(err: unknown){
            const error = err as AxiosError<{sucess: boolean; message: string}>
            const backendMsg = error.message;
            setFormError(BRAND_ERROR_MESSAGES[backendMsg]);
            setFormSuccess("");
        }
    }

    const confirmDelete = async () => {
        try {
            if(!deleteTarget) return;
            await brandApi.delete(deleteTarget._id ?? "");
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
    <div className="p-0 md:p-4 bg-white md:bg-transparent">
            {isLoading && (
                <p className="text-gray-500 text-center text-md sm:text-lg">Đang tải dữ liệu...</p>
            )}
    
            {!isLoading && (
                <div className="flex flex-col gap-3 p-3 bg-white">
                    <PageTitle title="Quản lí thương hiệu" subTitle="Quản lí thương hiệu và nhà cung cấp sản phẩm"/>
                    <div className="flex flex-col md:flex-row gap-5 items-center justify-center px-0 md:px-3 py-3">
                        <div className="bg-white border border-gray-200 rounded-xl md:flex-col lg:flex-row p-6 shadow-sm transition w-full md:w-1/3 flex items-center justify-between">
                            <p className="text-md md:text-lg font-semibold">Tổng thương hiệu</p>
                            <div className="flex flex-row items-center gap-2">
                                <p className="text-md md:text-lg font-bold">{brands.length}</p>
                                <Crown size={28} color="#e0e411" />
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-xl md:flex-col lg:flex-row p-6 shadow-sm transition w-full md:w-1/3 flex items-center justify-between">
                            <p className="text-md md:text-lg font-semibold">Đang hoạt động</p>
                            <div className="flex flex-row items-center gap-2">
                                <p className="text-md md:text-lg font-bold">{brands.length}</p>
                                <Globe size={28} color="#40c408" />
                            </div>
                        </div>

                    </div>
                    
                    <div className=" flex flex-col border border-gray-200 p-4 mx-0 rounded-md">
                        <div className="flex flex-row justify-between items-center px-4">
                            <div className="flex flex-row gap-2">
                               <Grid2X2 size={22} color="#146bdb"/> 
                               <p className="font-bold text-base">Danh sách thương hiệu</p>
                            </div>
                            <Button 
                                className="w-full max-w-25 bg-blue-500 font-bold text-md md:text-lg hover:bg-blue-600"
                                onClick={() => setOpenAdd(true)}
                                >
                                <Plus size={32} color="#fcf7f7" strokeWidth={3} />
                                Thêm
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 xl:px-8 gap-5 mt-4"  >
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
                            formError=""
                            formSuccess=""
                        />
                        <EditBrandDialog
                            open={openAdd}
                            setOpen={setOpenAdd}
                            brand={null}   
                            onSave={handleAdd}
                            formError={formError}
                            formSuccess={formSuccess}
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
