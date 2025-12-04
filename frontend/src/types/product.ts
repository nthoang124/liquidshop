export interface PCSpecs {
  cpu: string;
  ram: string;
  disk: string;
  vga?: string;
  mainboard: string;
  case: string;
}

export interface MouseSpecs {
  dpi: string;
  sensor: string;
  connection: string;
  weight: number;
  weightUnit: string;
  battery?: number;
  batteryUnit?: string;
  buttons?: string;
}

export interface KeyboardSpecs {
  switch: string;
  layout: string;
  connection: string;
  keycap: string;
  led?: string;
}

export type ProductSpecs = PCSpecs | MouseSpecs | KeyboardSpecs;
export type ProductCategory = "pc" | "mouse" | "keyboard";

export interface Product {
  id: number | string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  discountRate?: number;
  rating: number;
  reviewCount: number;
  hasGift?: boolean;

  category: ProductCategory;
  specs: ProductSpecs;
}
