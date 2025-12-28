import { DeleteBrandAlert } from "@/components/admin/brands/delete-brand-alert";
import PageTitle from "@/components/admin/common/PageTitle";
import { PromotionsTable } from "@/components/admin/promotions/promotions-table";
import { Button } from "@/components/ui/button";
import promotionApi from "@/services/api/admin/promotionApi";
import type { PromotionQuery } from "@/services/api/admin/query";
import type { IPromotion } from "@/types/promotion";
import { Grid2X2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<IPromotion[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPromotions, setTotalPromotions] = useState(0);
  const [status, setStatus] = useState("all");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const navigate = useNavigate();
  const limit = 5;

  const handleDetailOpen = (promotion: IPromotion) => {
    navigate(`/admin/promotions/${promotion._id}`);
  } 

  const handleConfirm = async () => {
    try {
      const res = await promotionApi.delete(deleteId);

      console.log("checl delete: ", res.data);
      setDeleteOpen(false);
      loadPromotions();
    }catch(error) { 
      console.log(error);
    }
  }

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setDeleteOpen(true);
  }
  
  const loadPromotions = async () => {
    try {
        const query: PromotionQuery = {
          page,
          limit,
        }

        if(status === "active") query.isActive = true;
        if(status === "inActive") query.isActive = false;

        const res = await promotionApi.getAll(query);
        setTotalPages(res.data.pages);
        setPromotions(res.data.data);
        setTotalPromotions(res.data.total);
    }catch(error){
        console.log(error);
    }
  }

  useEffect(() => {
    try {
      const fetchData = async () => {
          loadPromotions();
      }
      fetchData();
    }catch(error) {
        console.log(error);
    }
  }, [page, status]);

  return (
    <div className="p-0 md:p-4 md:bg-transparent">
      <div className="bg-white p-2 md:p-3">
        <PageTitle
          title="Quản lí mã giảm giá"
          subTitle="Quản lí các loại mã giảm giá, khuyến mãi"
        />
        <div className="border border-gray-200 p-3 shadow-lg rounded-lg mt-10">
          <div className="flex flex-col gap-3 sm:flex-row items-start sm:justify-between sm:items-center">
            <p className="flex flex-row gap-2 items-center font-bold">
              <Grid2X2 size={24} color="#3f6cf3"/>
              Tổng mã giảm giá: {totalPromotions}
            </p>

            <Button
              onClick={() => navigate('/admin/promotions/add')}
              className="bg-[#3385F0] text-white hover:bg-[#2B71CC] text-sm font-semibold max-w-35 w-full"
            >
              <Plus size={20}/>
              Thêm mã giảm
            </Button>
          </div>
          
          <PromotionsTable
            promotions={promotions}
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            handleDetailOpen={handleDetailOpen}
            status={status}
            setStatus={setStatus}
            onDelete={handleDelete}
          />

          <DeleteBrandAlert
            open={deleteOpen}
            setOpen={setDeleteOpen}
            brandName=""
            onConfirm={handleConfirm}
          />          
        </div>
      </div>
    </div>
  )
}
