import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const ORDER_STATUS = [
  { value: "pending_confirmation", label: "Chờ xác nhận" },
  { value: "processing", label: "Đang xử lý" },
  { value: "shipping", label: "Đang giao" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã huỷ" },
];

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export function OrderStatusSelect({ value, onChange }: Props) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Trạng thái đơn hàng" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">Trạng thái đơn</SelectItem>
        {ORDER_STATUS.map((s) => (
          <SelectItem key={s.value} value={s.value}>
            {s.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
