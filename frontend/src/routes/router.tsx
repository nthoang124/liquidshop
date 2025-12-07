import { createBrowserRouter } from "react-router-dom";
import React from "react";

import MainLayout from "@/components/layouts/MainLayout";
import HomePage from "@/pages/home/HomePage";

import AdminLayout from "@/components/layouts/AdminLayout";
import BrandsPage from "@/pages/admin/BrandsPage";
import UserDetailPage from "@/pages/admin/UserDetailPage"

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
const AddProductPage = React.lazy(() => import("@/pages/admin/AddProductPage"));
const CategoriesPage = React.lazy(() => import("@/pages/admin/CategoriesPage"));
const AddCategoriesPage = React.lazy(() => import("@/pages/admin/AddCategoriesPage"));


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
      {path: "products/add-new", element: <AddProductPage/> },
      {path: "categories/list", element: <CategoriesPage/>},
      {path: "categories/add-new", element: <AddCategoriesPage/>},
      {path: "brands", element: <BrandsPage/>},
      {path: "users/:id", element: <UserDetailPage/>}

    ],
  },
]);

export default router;
