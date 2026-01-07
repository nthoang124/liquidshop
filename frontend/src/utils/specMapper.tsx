import {
  Cpu,
  MemoryStick,
  HardDrive,
  Monitor,
  Layers,
  Keyboard,
  MousePointer2,
  Wifi,
  Battery,
  Scale,
  Component,
  Palette,
} from "lucide-react";
import type { IProduct } from "@/types/product";

export interface SpecItem {
  icon: any;
  label: string;
}

const cleanSpecValue = (key: string, value: string): string => {
  if (!value) return "";
  const v = value.toString().trim();

  const lowerKey = key.toLowerCase();

  if (lowerKey === "cpu" || lowerKey === "vi_xử_lý") {
    return v
      .replace(/(Bộ vi xử lý|CPU|Processor|Intel|AMD|®|™)/gi, "")
      .split(/[\/-]/)[0]
      .trim();
  }

  if (lowerKey === "ram" || lowerKey === "bộ_nhớ") {
    const gbMatch = v.match(/(\d+\s?GB)/i);
    const typeMatch = v.match(/(DDR\d|LPDDR\d)/i);
    if (gbMatch) {
      return `${gbMatch[0]}${typeMatch ? " " + typeMatch[0] : ""}`;
    }
    return v.split(" ")[0];
  }

  if (lowerKey === "vga" || lowerKey === "card_đồ_họa" || lowerKey === "gpu") {
    const modelMatch = v.match(
      /(RTX\s?\d+\s?\w*|GTX\s?\d+|RX\s?\d+\s?\w*|Arc\s?\w+)/i
    );
    if (modelMatch) return modelMatch[0];
    return v
      .replace(/(Card màn hình|VGA|NVIDIA|GeForce|AMD|Radeon)/gi, "")
      .trim()
      .split(" ")
      .slice(0, 2)
      .join(" ");
  }

  if (
    lowerKey === "ssd" ||
    lowerKey === "hdd" ||
    lowerKey === "storage" ||
    lowerKey === "ổ_cứng"
  ) {
    const capMatch = v.match(/(\d+\s?(TB|GB))/i);
    return capMatch ? capMatch[0] : v;
  }

  if (lowerKey === "screen" || lowerKey === "màn_hình") {
    const sizeMatch = v.match(/(\d+(\.\d+)?)\s?("|inch)/i);
    const panelMatch = v.match(/(OLED|IPS|AMOLED|TN|VA)/i);
    const resMatch = v.match(/(FHD|2K|3K|4K|QHD)/i);

    let result = sizeMatch ? sizeMatch[1] + '"' : "";
    if (resMatch) result += " " + resMatch[0];
    else if (panelMatch) result += " " + panelMatch[0];

    return result || v.split(",")[0];
  }

  if (
    lowerKey === "kết_nối" ||
    lowerKey === "kieu_ket_noi" ||
    lowerKey === "cong_ket_noi"
  ) {
    if (
      (v.includes("Bluetooth") || v.includes("BT")) &&
      (v.includes("Wireless") || v.includes("2.4"))
    ) {
      return "3 Mode";
    }
    if (v.includes("Wireless") || v.includes("Không dây")) return "Wireless";
    if (v.includes("USB")) return "USB";
    if (v.includes("Bluetooth")) return "Bluetooth";
    if (v.includes("Dây") || v.includes("Wired") || v.includes("Type-C"))
      return "Có dây";
    return "Đa kết nối";
  }

  if (lowerKey === "switch" || lowerKey === "switch_bàn_phím") {
    const brand = v.match(/(Cherry|Gateron|Kailh|Akko|Outemu|Keychron)/i);
    const color = v.match(/(Red|Blue|Brown|Black|White|Banana|Silent)/i);
    if (brand || color) {
      return `${brand ? brand[0] : ""} ${color ? color[0] : "Switch"}`.trim();
    }
    return v.split("-")[0].split(",")[0].trim();
  }

  if (
    lowerKey === "pin" ||
    lowerKey === "dung_lượng_pin" ||
    lowerKey === "thời_lượng_pin" ||
    lowerKey === "battery"
  ) {
    const timeMatch = v.match(/(\d+\s?(giờ|h))/i);
    const capMatch = v.match(/(\d+\s?mAh)/i);
    const cellMatch = v.match(/(\d+\s?Wh)/i);
    return timeMatch
      ? timeMatch[0]
      : capMatch
      ? capMatch[0]
      : cellMatch
      ? cellMatch[0]
      : v;
  }

  if (
    lowerKey === "layout" ||
    lowerKey === "thiết_kế" ||
    lowerKey === "layout_bàn_phím" ||
    lowerKey === "size"
  ) {
    if (v.match(/TKL/i)) return "TKL";
    if (v.match(/Full/i)) return "Fullsize";
    if (v.match(/60%/)) return "60%";
    if (v.match(/75%/)) return "75%";
    return v.split("(")[0].trim();
  }

  if (lowerKey === "dpi" || lowerKey === "độ_phân_giải") {
    return v + (v.toLowerCase().includes("dpi") ? "" : " DPI");
  }

  if (lowerKey === "trọng_lượng" || lowerKey === "weight") {
    return v.replace("~", "").trim();
  }

  return v;
};

export const getProductSpecsAttrs = (product: IProduct): SpecItem[] => {
  const specs = product.specifications || {};
  const items: SpecItem[] = [];

  const priorityKeys = [
    { key: ["cpu", "vi_xử_lý"], icon: Cpu },
    { key: ["ram", "bộ_nhớ"], icon: MemoryStick },
    { key: ["vga", "card_đồ_họa", "gpu"], icon: Layers },
    { key: ["ssd", "hdd", "storage", "ổ_cứng"], icon: HardDrive },
    { key: ["screen", "màn_hình"], icon: Monitor },

    { key: ["switch", "switch_bàn_phím"], icon: Component },
    { key: ["layout", "thiết_kế", "layout_bàn_phím", "size"], icon: Keyboard },
    { key: ["dpi", "độ_phân_giải"], icon: MousePointer2 },
    {
      key: ["kết_nối", "kieu_ket_noi", "chuẩn_kết_nối", "cong_ket_noi"],
      icon: Wifi,
    },
    {
      key: ["pin", "dung_lượng_pin", "thời_lượng_pin", "battery"],
      icon: Battery,
    },
    { key: ["trọng_lượng", "weight"], icon: Scale },
    { key: ["led", "đèn_led", "đèn_nền"], icon: Palette },
  ];

  priorityKeys.forEach(({ key, icon }) => {
    const keysToCheck = Array.isArray(key) ? key : [key];

    let value = "";
    let foundKey = "";

    for (const k of keysToCheck) {
      if (specs[k]) {
        value = specs[k];
        foundKey = k;
        break;
      }

      if (specs[k.toLowerCase()]) {
        value = specs[k.toLowerCase()];
        foundKey = k.toLowerCase();
        break;
      }
    }

    if (value && typeof value === "string") {
      const shortValue = cleanSpecValue(foundKey, value);

      if (shortValue) {
        items.push({
          icon: icon,
          label: shortValue,
        });
      }
    }
  });

  return items.slice(0, 4);
};
