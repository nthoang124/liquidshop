export function getOrderStatusStyle(status: string) {
  switch (status) {
    case "pending_confirmation":
      return "bg-yellow-100 text-yellow-700";
    case "processing":
      return "bg-blue-100 text-blue-700";
    case "shipping":
      return "bg-purple-100 text-purple-700";
    case "completed":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export function formatOrderStatus(status: string) {
  switch (status) {
    case "pending_confirmation":
      return "Chờ xác nhận";
    case "processing":
      return "Đang xử lý";
    case "shipping":
      return "Đang giao";
    case "completed":
      return "Hoàn thành";
    case "cancelled":
      return "Đã hủy";
    default:
      return status;
  }
}
