export interface IOrder {
  _id: string;

  orderCode: string;

  userId: string;

  customerInfo: {
    fullName: string;
    email: string;
    phoneNumber: string;
    shippingAddress: {
      street: string;
      ward: string;
      district: string;
      city: string;
    };
  };

  items: {
    productId: string;
    name: string;
    sku: string;
    quantity: number;
    price: number;
  }[];

  subtotal: number;
  shippingFee: number;
  discountAmount: number;

  voucherCode?: string;

  totalAmount: number;

  paymentMethod: "COD" | "BankTransfer" | "OnlineGateway";

  paymentStatus: "pending" | "paid" | "failed";

  orderStatus:
    | "pending_confirmation"
    | "processing"
    | "shipping"
    | "completed"
    | "cancelled";

  notes?: string;

  createdAt: string;
  updatedAt?: string;
}

export interface IOrderListResponse {
  success: boolean;
  count: number;
  page: number;
  totalPages: number;
  data: IOrder[];
}

// Thêm interface cho Payload tạo đơn hàng
export interface ICreateOrderPayload {
  paymentMethod: "COD" | "BankTransfer" | "OnlineGateway";
  paymentProvider?: "VNPAY" | "Momo";
  voucherCode?: string;
  notes?: string;
  items: string[];
}

// Interface cho response trả về khi tạo đơn thành công
export interface ICreateOrderResponse {
  message: string;
  order: IOrder;
  paymentUrl?: string | null;
}
