import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const PAYMENT_STATUS = [
  { value: "pending", label: "Chờ thanh toán" },
  { value: "paid", label: "Đã thanh toán" },
  { value: "failed", label: "Thanh toán thất bại" },
];

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export function PaymentStatusSelect({ value, onChange }: Props) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Trạng thái thanh toán" />
      </SelectTrigger>

      <SelectContent className="text-sm md:text-base">
        <SelectItem value="all">Thanh toán</SelectItem>
        {PAYMENT_STATUS.map((s) => (
          <SelectItem  key={s.value} value={s.value}>
            {s.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

