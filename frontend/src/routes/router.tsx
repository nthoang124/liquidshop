import { createBrowserRouter } from "react-router-dom";
import React from "react";
import ProtectedRouteAdmin from "./ProtectedRouteAdmin";
import ProtectedRouteCustomer from "./ProtectedRouteCustomer";

import MainLayout from "@/components/layouts/MainLayout";
import HomePage from "@/pages/home/HomePage";

//CUSTOMER

const CustomerLoginPage = React.lazy(
  () => import("@/pages/customer/LoginPage")
);

const CustomerRegisterPage = React.lazy(
  () => import("@/pages/customer/RegisterPage")
);

const CustomerForgotPasswordPage = React.lazy(
  () => import("@/pages/customer/ForgotPasswordPage")
);

const CustomerResetPasswordPage = React.lazy(
  () => import("@/pages/customer/ResetPasswordPage")
);

const CustomerProfilePage = React.lazy(
  () => import("@/pages/customer/Profile/Profile")
);

//PRODUCT

const CategoryDetailPage = React.lazy(
  () => import("@/pages/product/CategoryDetailPage")
);

const ProductDetailPage = React.lazy(
  () => import("@/pages/product/ProductDetail")
);

const OrderLookupPage = React.lazy(
  () => import("@/pages/order/orderLookupPage")
);

import AdminLayout from "@/components/layouts/AdminLayout";
import BrandsPage from "@/pages/admin/BrandsPage";
import UserDetailPage from "@/pages/admin/UserDetailPage";
import EditProductPage from "@/pages/admin/EditProductPage";
import AdminLoginPage from "@/pages/admin/LoginPage";
import OrdersPage from "@/pages/admin/OrdersPage";

const DashboardPage = React.lazy(() => import("@/pages/admin/DashboardPage"));
const UsersPage = React.lazy(() => import("@/pages/admin/UsersPage"));
const ProductsPage = React.lazy(() => import("@/pages/admin/ProductsPage"));
const AddProductPage = React.lazy(() => import("@/pages/admin/AddProductPage"));
const CategoriesPage = React.lazy(() => import("@/pages/admin/CategoriesPage"));
const AddCategoriesPage = React.lazy(
  () => import("@/pages/admin/AddCategoriesPage")
);
const ReviewsPage = React.lazy(() => import("@/pages/admin/ReviewsPage"));

const ErrorPage = React.lazy(() => import("@/pages/errorPage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "product/:category/:id", element: <ProductDetailPage /> },
      {
        element: <ProtectedRouteCustomer />,
        children: [
          { path: "users/me", element: <CustomerProfilePage /> },
          { path: "order/lookup", element: <OrderLookupPage /> },
        ],
      },
      {
        path: "/category/:id",
        element: <CategoryDetailPage />,
      },
    ],
  },
  {
    path: "/auth/login/customer",
    element: <CustomerLoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/auth/register/customer",
    element: <CustomerRegisterPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/auth/reset-password",
    element: <CustomerForgotPasswordPage />,
    errorElement: <ErrorPage />,
  },
  { path: "/reset-password/:token", element: <CustomerResetPasswordPage /> },
  {
    path: "/admin",
    element: (
      <ProtectedRouteAdmin>
        <AdminLayout />
      </ProtectedRouteAdmin>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "users", element: <UsersPage /> },
      { path: "products/list", element: <ProductsPage /> },
      { path: "products/add-new", element: <AddProductPage /> },
      { path: "categories/list", element: <CategoriesPage /> },
      { path: "categories/add-new", element: <AddCategoriesPage /> },
      { path: "brands", element: <BrandsPage /> },
      { path: "users/:id", element: <UserDetailPage /> },
      { path: "product/edit/:id", element: <EditProductPage /> },
      { path: "orders", element: <OrdersPage /> },
      { path: "reviews", element: <ReviewsPage /> },
    ],
  },
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
    errorElement: <ErrorPage />,
  },
]);

export default router;
