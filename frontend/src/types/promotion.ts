export interface IPromotion {
  _id: string;             
  code: string;
  description?: string;

  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;

  minOrderAmount?: number;
  maxDiscountAmount?: number;

  startDate?: Date | string;
  endDate?: Date | string;

  usageLimit?: number;
  usedCount?: number;

  isActive?: boolean;

  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface IPromotionListResponse {
  success: boolean;
  total: number;
  page: number;
  pages: number;
  data: IPromotion[];
}

export interface IPromotionUpdate {
  id?: string;
  startDate: string | null;
  endDate: string | null;
  description?: string;
  discountType?: "percentage" | "fixed_amount";
  discountValue?: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  isActive?: boolean;
}
