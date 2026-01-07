import { orderService } from "@/services/api/customer/order.service";

export const myOrdersLoader = async ({ request }: any) => {
  const url = new URL(request.url);
  const searchCode = url.searchParams.get("code") || "";

  try {
    if (searchCode) {
      const res: any = await orderService.getOrderByCode(searchCode.trim());
      return {
        orders: res && res.order ? [res.order] : [],
        isSearching: true,
        searchCode
      };
    }

    const res: any = await orderService.getMyOrders();
    const allOrders = (res.data || []).sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      orders: allOrders,
      isSearching: false,
      searchCode: ""
    };
  } catch (error) {
    console.error("MyOrders Loader Error:", error);
    return {
      orders: [],
      isSearching: !!searchCode,
      searchCode
    };
  }
};