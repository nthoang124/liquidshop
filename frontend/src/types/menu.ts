// types/menu.ts (Gợi ý)
import { type ReactNode } from "react";

export interface ISubCategory {
  title: string;
  items: string[];
}

export interface ICategoryMenu {
  name: string;
  icon: ReactNode;
  sub: ISubCategory[];
}
