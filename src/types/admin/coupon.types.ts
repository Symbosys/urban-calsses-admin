export type DiscountType = "PERCENTAGE" | "FIXED";

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  validFrom: string;
  validTill: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponInput {
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  validFrom: string;
  validTill: string;
  minOrderAmount?: number;
  maxUses?: number;
  isActive?: boolean;
}

export interface UpdateCouponInput extends Partial<CreateCouponInput> {}
