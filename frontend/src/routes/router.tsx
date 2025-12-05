import { createBrowserRouter } from "react-router-dom";
import React from "react";

import MainLayout from "@/components/layouts/MainLayout";
import HomePage from "@/pages/home/HomePage";

import AdminLayout from "@/components/layouts/AdminLayout";

// Lazy loaded pages
const ProductDetailPage = React.lazy(
  () => import("@/pages/product/ProductDetail")
);
const ShowroomPage = React.lazy(() => import("@/pages/showRoom"));
const ErrorPage = React.lazy(() => import("@/pages/errorPage"));
const OrderLookupPage = React.lazy(() => import("@/pages/orderLookupPage"));
const DashboardPage = React.lazy(() => import("@/pages/admin/DashboardPage"));
const UsersPage = React.lazy(() => import("@/pages/admin/UsersPage"));
const ProductsPage = React.lazy(() => import("@/pages/admin/ProductsPage"));

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
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "customers", element: <UsersPage /> },
      { path: "products/list", element: <ProductsPage /> },
    ],
  },
]);

export default router;
