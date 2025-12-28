export const PAYMENT_STATUS = {
    pending: "Chờ thanh toán",
    paid: "Đã thanh toán",
    failed: "Thất bại"
} as const 

export function getPaymentStatusLabel(status: keyof typeof PAYMENT_STATUS) {
    return PAYMENT_STATUS[status];
}