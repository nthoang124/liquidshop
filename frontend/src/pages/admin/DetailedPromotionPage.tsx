import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { IPromotion, IPromotionUpdate } from "@/types/promotion";
import { useNavigate, useParams } from "react-router-dom";
import promotionApi from "@/services/api/admin/promotionApi";
import PageTitle from "@/components/admin/common/PageTitle";
import { ChevronLeft, Eye, PenSquare } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Calendar24 } from "@/components/admin/promotions/calendar";
import { SelectContent, SelectItem, Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mergeDateTime } from "@/utils/admin/formatDate";


export default function DetailedPromotion() {
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState<Partial<IPromotion>>({});
  const [promotion, setPromotion] = useState<IPromotion | null>(null);
  const { id } = useParams<{ id: string }>();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>("");
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState<string>("");

  const navigate = useNavigate();

  const loadPromotion = async () => {
    try {
        if(!id) return;
        const res = await promotionApi.getById(id);
        setPromotion(res.data.data);
        setForm(res.data.data);

        const created_at = res.data.data.startDate
          ? new Date(res.data.data.startDate)
          : undefined;
        setStartDate(created_at);
        setStartTime(
          created_at.toLocaleTimeString("en-GB", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        );

        const expired_at = res.data.data.endDate
          ? new Date(res.data.data.endDate)
          : undefined;
        setEndDate(expired_at);
        setEndTime(
          expired_at.toLocaleTimeString("en-GB", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        );
    }catch(error) {
        console.log(error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
        try {
            loadPromotion();
        }catch(error) {
            console.log(error)
        }
    }
    fetchData();
  },[id]);

  const handleChange = (key: keyof IPromotion, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      if(!id) return;

      const st = mergeDateTime(startDate, startTime);
      const ed = mergeDateTime(endDate, endTime);

      const payload: IPromotionUpdate = {
        ...form,
        startDate: st,
        endDate: ed
      };

      await promotionApi.update(id, payload);

      loadPromotion();

      setIsEdit(false);
    }catch(error){
      console.log(error);
    }
  };

  const handleCancel = () => {
    setForm(promotion);
    setIsEdit(false);
  };
    
  if (!promotion) {
    return <div>Không tìm thấy mã giảm giá</div>;
  }

  return (
    <div className="space-y-6 p-2 md:p-4 bg-white md:bg-transparent">
      <PageTitle
        title="Thông tin mã giảm giá"
        subTitle="Kiểm tra và cập nhật thông tin mã giảm giá"
      />
      {/* HEADER */}
      <div className="flex items-center justify-between gap-1">

        <Button
          className="bg-zinc-50 text-black border border-gray-300 hover:bg-zinc-100 text-sm w-full max-w-24"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft/>
          Quay lại
        </Button>

        {!isEdit ? (
          <Button 
              className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
              variant="outline" onClick={() => setIsEdit(true)}>
            <PenSquare/>
            Chỉnh sửa
          </Button>
        ) : (
          <Button 
              className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
              variant="outline" 
              onClick={() => {
                handleCancel()
              }}
            >
            <Eye/>
            Xem
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Thông tin cơ bản</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-x-2 flex items-center">
            <span className="text-md font-medium">
                {promotion.isActive ? "Đang hoạt động" : "Đã tắt"}
            </span>       
            <Switch
                className="data-[state=checked]:bg-green-500
                data-[state=unchecked]:bg-gray-300"
                disabled={!isEdit}
                checked={form.isActive}
                onCheckedChange={(checked) => handleChange("isActive", checked)}
            />
          </div>
          <div className="col-span-2 space-y-1">
            <Label className="text-sm md:text-base">Mô tả</Label>
            <Textarea
              className="text-sm"
              disabled={!isEdit}
              value={form.description ?? ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-sm md:text-base">Giá trị giảm</Label>
            <input
              className="input-pro"
              type="number"
              disabled={!isEdit}
              value={form.discountValue ?? 0}
              onChange={(e) =>
                handleChange("discountValue", Number(e.target.value))
              }
            />
          </div>

          <div className="space-y-1">
            <Label className="text-sm md:text-base">Loại giảm giá</Label>
            <Select value={form.discountType} onValueChange={(value) => 
                handleChange("discountType", value)
              }
            >
              <SelectTrigger 
                disabled={!isEdit}
                className="max-w-35 w-full">
                <SelectValue placeholder={form.discountType}/>
              </SelectTrigger>

              <SelectContent className="text-sm">
                <SelectItem className="text-sm" value="percentage">Phần trăm</SelectItem>
                <SelectItem value="fixed_amount">VNĐ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-sm md:text-base">Đơn tối thiểu (VNĐ)</Label>
            <input
              className="input-pro"
              type="number"
              disabled={!isEdit}
              value={form.minOrderAmount ?? 0}
              onChange={(e) =>
                handleChange("minOrderAmount", Number(e.target.value))
              }
            />
          </div>

          <div className="space-y-1">
            <Label className="text-sm md:text-base">Giảm tối đa (VNĐ)</Label>
            <input
              className="input-pro"
              type="number"
              disabled={!isEdit}
              value={form.maxDiscountAmount ?? 0}
              onChange={(e) =>
                handleChange("maxDiscountAmount", Number(e.target.value))
              }
            />
          </div>
          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Calendar24
              date={startDate}
              time={startTime}
              onChangeDate={setStartDate}
              onChangeTime={setStartTime}
              isEdit={isEdit}
              isStart={true}
            />
          </div>

          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Calendar24
              date={endDate}
              time={endTime}
              onChangeDate={setEndDate}
              onChangeTime={setEndTime}
              isEdit={isEdit}
              isStart={false}
            />
          </div>
        </CardContent>
      </Card>

      {/* THỐNG KÊ */}
      <Card>
        <CardHeader>
          <CardTitle>Thống kê sử dụng</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-2 sm:grid-cols-3 text-center gap-1">
          <div className="flex flex-col items-center">
            <p className="text-sm md:text-base text-muted-foreground">Đã dùng</p>
            <p className="text-md md:text-lg font-bold border border-gray-400 bg-zinc-100 rounded-sm w-full max-w-20">
              {promotion.usedCount}
            </p>
          </div>
          <div className="gap-1 flex flex-col items-center">
            <Label className="text-sm md:text-base text-muted-foreground">Số lượng</Label>
            <input
                className="input-pro max-w-20 w-full h-8"
                type="number"
                disabled={!isEdit}
                value={form.usageLimit ?? 0}
                onChange={(e) => 
                    handleChange("usageLimit", Number(e.target.value))
                }
            >
            </input>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm md:text-base text-muted-foreground">Còn lại</p>
            <p className="text-md md:text-lg font-bold border border-gray-400 bg-zinc-100 rounded-sm w-full max-w-20">
              {(promotion.usageLimit ?? 0) - (promotion.usedCount ?? 0)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3">
        {isEdit && (
          <>
            <Button 
              className="text-sm"
              variant="outline" 
              onClick={handleCancel}>
              Huỷ
            </Button>
            <Button 
                className="bg-green-500 text-white text-sm hover:bg-green-600"
                onClick={handleSave}>
              Lưu thay đổi
            </Button>
          </>
        )} 
      </div>
    </div>
  );
}
