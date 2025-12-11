export function formatVND(amount: number) {
  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}
