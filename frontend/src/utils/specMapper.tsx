// src/utils/specMapper.tsx
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
import type {
  Product,
  PCSpecs,
  MouseSpecs,
  KeyboardSpecs,
} from "@/types/product";

interface SpecItem {
  icon: React.ElementType;
  label: string;
}

export const getProductSpecsAttrs = (product: Product): SpecItem[] => {
  const { category, specs } = product;

  if (category === "pc") {
    const s = specs as PCSpecs;
    return [
      { icon: Cpu, label: s.cpu },
      { icon: CircuitBoard, label: s.vga || "Onboard" },
      { icon: Layers, label: s.ram },
      { icon: HardDrive, label: s.disk },
      { icon: Monitor, label: s.mainboard },
      { icon: Inbox, label: s.case },
    ];
  }

  if (category === "mouse") {
    const s = specs as MouseSpecs;
    const items = [
      { icon: MousePointer2, label: s.dpi },
      { icon: Zap, label: s.sensor },
      { icon: Wifi, label: s.connection },
      { icon: Scale, label: s.weight },
    ];
    if (s.battery) items.push({ icon: Battery, label: s.battery });
    return items;
  }

  if (category === "keyboard") {
    const s = specs as KeyboardSpecs;
    return [
      { icon: Keyboard, label: s.switch },
      { icon: Grid, label: s.layout },
      { icon: Wifi, label: s.connection },
      { icon: Type, label: s.keycap },
      { icon: Lightbulb, label: s.led || "No LED" },
    ];
  }

  return [];
};
