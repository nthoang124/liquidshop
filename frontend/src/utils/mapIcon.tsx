import {
  Laptop,
  Smartphone,
  Mouse,
  Keyboard,
  Monitor,
  Headset,
  Speaker,
  Cpu,
  Menu,
} from "lucide-react";

const getCategoryIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("laptop")) return <Laptop className="w-5 h-5" />;
  if (lowerName.includes("điện thoại"))
    return <Smartphone className="w-5 h-5" />;
  if (lowerName.includes("chuột")) return <Mouse className="w-5 h-5" />;
  if (lowerName.includes("bàn phím")) return <Keyboard className="w-5 h-5" />;
  if (lowerName.includes("màn hình")) return <Monitor className="w-5 h-5" />;
  if (lowerName.includes("tai nghe")) return <Headset className="w-5 h-5" />;
  if (lowerName.includes("loa")) return <Speaker className="w-5 h-5" />;
  if (lowerName.includes("linh kiện")) return <Cpu className="w-5 h-5" />;
  return <Menu className="w-5 h-5" />; // Icon mặc định
};

export default getCategoryIcon;
