import { createBrowserRouter } from "react-router-dom";
import React from "react";

import MainLayout from "@/components/layouts/MainLayout";
import HomePage from "@/pages/home/HomePage";

const ProductDetailPage = React.lazy(
  () => import("@/pages/product/ProductDetail")
);
const ShowroomPage = React.lazy(() => import("@/pages/showRoom"));
const ErrorPage = React.lazy(() => import("@/pages/errorPage"));
const OrderLookupPage = React.lazy(() => import("@/pages/orderLookupPage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "product/:category/:id", element: <ProductDetailPage /> },
      { path: "order/lookup", element: <OrderLookupPage /> },
      { path: "showroom", element: <ShowroomPage /> },
    ],
  },
]);

export default router;
