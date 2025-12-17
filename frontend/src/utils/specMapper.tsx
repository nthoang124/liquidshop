import React from "react";
import {
  Cpu,
  HardDrive,
  Layers,
  Monitor,
  CircuitBoard,
  MousePointer2,
  Zap,
  Wifi,
  Scale,
  Battery,
  Keyboard,
  Grid,
  Lightbulb,
  Type,
  Inbox,
} from "lucide-react";

import { type IProduct } from "@/types/product";

interface SpecItem {
  icon: React.ElementType;
  label: string;
}

export const getProductSpecsAttrs = (product: IProduct): SpecItem[] => {
  const specs = product.specifications || {};

  const categoryName =
    typeof product.category === "object"
      ? product.category.name.toLowerCase()
      : String(product.category).toLowerCase();

  // --- PC ---
  if (
    categoryName === "pc" ||
    categoryName === "desktop" ||
    categoryName.includes("laptop")
  ) {
    const items: SpecItem[] = [];

    if (specs.cpu) {
      items.push({ icon: Cpu, label: specs.cpu });
    }

    if (specs.gpu || specs.vga)
      items.push({
        icon: CircuitBoard,
        label: specs.gpu || specs.vga || "Onboard",
      });

    if (specs.ram) items.push({ icon: Layers, label: specs.ram });

    if (specs.storage || specs.disk || specs.ssd)
      items.push({
        icon: HardDrive,
        label: specs.storage || specs.disk || specs.ssd || "",
      });

    if (specs.screen)
      items.push({
        icon: Monitor,
        label: specs.screen,
      });

    if (specs.mainboard)
      items.push({ icon: CircuitBoard, label: specs.mainboard });
    if (specs.case) items.push({ icon: Inbox, label: specs.case });

    return items;
  }

  // --- LAPTOP ---
  if (categoryName === "laptop") {
    const items: SpecItem[] = [];

    if (specs.cpu) items.push({ icon: Cpu, label: specs.cpu });
    if (specs.ram) items.push({ icon: Layers, label: specs.ram });
    if (specs.storage) items.push({ icon: HardDrive, label: specs.storage });
    if (specs.screen) items.push({ icon: Monitor, label: specs.screen });
    if (specs.gpu) items.push({ icon: CircuitBoard, label: specs.gpu });

    return items;
  }

  // --- MOUSE ---
  if (categoryName === "mouse" || categoryName === "chuột") {
    const items: SpecItem[] = [];

    if (specs.dpi) items.push({ icon: MousePointer2, label: specs.dpi });
    if (specs.sensor) items.push({ icon: Zap, label: specs.sensor });
    if (specs.connection) items.push({ icon: Wifi, label: specs.connection });
    if (specs.weight) items.push({ icon: Scale, label: specs.weight });
    if (specs.battery) items.push({ icon: Battery, label: specs.battery });

    return items;
  }

  // --- KEYBOARD ---
  if (categoryName === "keyboard" || categoryName === "bàn phím") {
    const items: SpecItem[] = [];

    if (specs.switch) items.push({ icon: Keyboard, label: specs.switch });
    if (specs.layout) items.push({ icon: Grid, label: specs.layout });
    if (specs.connection) items.push({ icon: Wifi, label: specs.connection });
    if (specs.keycap) items.push({ icon: Type, label: specs.keycap });
    if (specs.led) items.push({ icon: Lightbulb, label: specs.led });

    return items;
  }

  return [];
};
