import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { IPromotion, IPromotionUpdate } from "@/types/promotion";
import { useNavigate } from "react-router-dom";
import promotionApi from "@/services/api/admin/promotionApi";
import PageTitle from "@/components/admin/common/PageTitle";
import { ChevronLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Calendar24 } from "@/components/admin/promotions/calendar";
import { SelectContent, SelectItem, Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mergeDateTime } from "@/utils/admin/formatDate";
import { toast } from "sonner";
import type { AxiosError } from "axios";


export default function AddPromotionPage() {
  const [form, setForm] = useState<Partial<IPromotion>>({isActive: false, minOrderAmount: 0});
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>("");
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState<string>("");

  const navigate = useNavigate();

  
  const handleChange = (key: keyof IPromotion, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      const requiredFields = [
        "code", 
        "description", 
        "discountType", 
        "discountValue", 
        "minOrderAmount", 
        "maxDiscountAmount", 
        "usageLimit", 
      ] as const

      const st = mergeDateTime(startDate, startTime);
      const ed = mergeDateTime(endDate, endTime);

      const isInValid = requiredFields.some(
        key => form[key] === null
      ) || st === null;

      if(isInValid) {
        toast.error("Vui lòng điền đầy đủ thông tin");
        return;
      }

      const payload: IPromotionUpdate = {
        ...form,
        startDate: st,
        endDate: ed
      };

      await promotionApi.create(payload);

      toast.success("Tạo mã giảm giá thành công");
    }catch(err: unknown){
        const error = err as AxiosError<{message: string}>;
        const msg = error.message ?? "Lỗi hệ thống";
        toast.error(msg);
    }
  };

  const handleCancel = () => {
    setForm({});
  }

  return (
    <div className="space-y-6 p-2 md:p-4 bg-white md:bg-transparent">
      <PageTitle
        title="Thêm mã giảm giá"
        subTitle="Tạo mới mã giảm giá, khuyến mãi"
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Thông tin cơ bản</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-x-2 flex items-center">
            <span className="text-md font-medium">
               Hoạt động
            </span>       
            <Switch
                className="data-[state=checked]:bg-green-500
                data-[state=unchecked]:bg-gray-300"
                checked={form.isActive ?? false}
                onCheckedChange={(checked) => handleChange("isActive", checked)}
            />
          </div>
          <div className="space-y-1">
            <Label>Mã giảm giá</Label>
            <Input
                className="text-sm md:text-base"
                value={form.code}
                onChange={(e) => handleChange("code", e.target.value)}
            >   
            </Input>
          </div>
          <div className="col-span-2 space-y-1">
            <Label className="text-sm md:text-base">Mô tả</Label>
            <Textarea
              className="text-sm"
              value={form.description ?? ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-sm md:text-base">Giá trị giảm</Label>
            <Input
              className="text-sm md:text-base"
              type="number"
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
            <Input
              className="text-sm md:text-base"
              type="number"
              value={form.minOrderAmount ?? 0}
              onChange={(e) =>
                handleChange("minOrderAmount", Number(e.target.value))
              }
            />
          </div>

          <div className="space-y-1">
            <Label className="text-sm md:text-base">Giảm tối đa (VNĐ)</Label>
            <Input
              className="text-sm md:text-base"
              type="number"
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
              isEdit={true}
              isStart={true}
            />
          </div>

          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Calendar24
              date={endDate}
              time={endTime}
              onChangeDate={setEndDate}
              onChangeTime={setEndTime}
              isEdit={true}
              isStart={false}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-sm md:text-base text-muted-foreground">Số lượng</Label>
            <Input
                className="max-w-20 w-full text-sm md:text-[0.9rem] rounded-lg h-8"
                type="number"
                value={form.usageLimit ?? 0}
                onChange={(e) => 
                    handleChange("usageLimit", Number(e.target.value))
                }
            >
            </Input>
          </div>
        </CardContent>
      </Card>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3">
        <Button 
            className="text-sm"
            variant="outline" 
            onClick={handleCancel}>
            Huỷ
        </Button>
        <Button 
            className="bg-green-500 text-white text-sm hover:bg-green-600"
            onClick={handleSave}>
            Tạo mới
        </Button>
      </div>
    </div>
  );
}
