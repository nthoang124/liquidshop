import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
    value: string,
    onChange: (value: string) => void;
}

export default function PromotionStatusSelect({value, onChange} : Props) {

  const PROMOTION_STATUS = [
    { value: "all", label: "Trạng thái" },
    { value: "active", label: "Hoạt động"},
    { value: "inActive", label: "Không hoạt động"}
  ];

  return (
    <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-transparent ">
            <SelectValue placeholder="Trạng thái"/>
        </SelectTrigger>
        <SelectContent>
            {PROMOTION_STATUS.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
        </SelectContent>
    </Select>
  )
}
