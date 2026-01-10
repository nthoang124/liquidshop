import { createBrowserRouter } from "react-router-dom";
import React from "react";
import ProtectedRouteAdmin from "./ProtectedRouteAdmin";
import ProtectedRouteCustomer from "./ProtectedRouteCustomer";

import MainLayout from "@/components/layouts/MainLayout";
import AuthLayout from "@/components/layouts/AuthLayout";
import HomePage from "@/pages/home/HomePage";

//CUSTOMER

const CustomerLoginPage = React.lazy(
  () => import("@/pages/customer/auth/LoginPage")
);
const CustomerRegisterPage = React.lazy(
  () => import("@/pages/customer/auth/RegisterPage")
);
const CustomerForgotPasswordPage = React.lazy(
  () => import("@/pages/customer/auth/ForgotPasswordPage")
);
const CustomerResetPasswordPage = React.lazy(
  () => import("@/pages/customer/auth/ResetPasswordPage")
);
const CustomerProfilePage = React.lazy(
  () => import("@/pages/customer/Profile/Profile")
);
const CustomerCartPage = React.lazy(() => import("@/pages/cart/CartPage"));
// PRODUCT

const CategoryDetailPage = React.lazy(
  () => import("@/pages/product/CategoryDetailPage")
);
const ProductDetailPage = React.lazy(
  () => import("@/pages/product/ProductDetailPage")
);
const CheckoutPage = React.lazy(() => import("@/pages/order/CheckoutPage"));
const OrderDetailPage = React.lazy(
  () => import("@/pages/order/OrderDetailPage")
);
const OrderSuccessPage = React.lazy(
  () => import("@/pages/order/OrderSuccessPage")
);
const OrderErrorPage = React.lazy(() => import("@/pages/order/OrderErrorPage"));
const SearchPage = React.lazy(() => import("@/pages/product/SearchPage"));

// ADMIN

import AdminLayout from "@/components/layouts/AdminLayout";
import AdminLoginPage from "@/pages/admin/LoginPage";

const DashboardPage = React.lazy(() => import("@/pages/admin/DashboardPage"));
const UsersPage = React.lazy(() => import("@/pages/admin/UsersPage"));
const UserDetailPage = React.lazy(() => import("@/pages/admin/UserDetailPage"));
const ProductsPage = React.lazy(() => import("@/pages/admin/ProductsPage"));
const AddProductPage = React.lazy(() => import("@/pages/admin/AddProductPage"));
const CategoriesPage = React.lazy(() => import("@/pages/admin/CategoriesPage"));
const BrandsPage = React.lazy(() => import("@/pages/admin/BrandsPage"));
const ReviewsPage = React.lazy(() => import("@/pages/admin/ReviewsPage"));
const PromotionPage = React.lazy(() => import("@/pages/admin/PromotionsPage"));
const AddPromotionPage = React.lazy(() => import("@/pages/admin/AddPromotionPage"));
const OrdersPage = React.lazy(() => import("@/pages/admin/OrdersPage"))
const EditProductPage = React.lazy(() => import("@/pages/admin/EditProductPage"));
const DetailedPromotion = React.lazy(() => import("@/pages/admin/DetailedPromotionPage"));


const ErrorPage = React.lazy(() => import("@/pages/errorPage"));

// LOADER
import { homeLoader } from "@/pages/home/home.loader";
import { categoryDetailLoader } from "@/pages/product/category.loader";
import { searchLoader } from "@/pages/product/search.loader";
import { myOrdersLoader } from "@/pages/customer/Profile/order.loader";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage />, loader: homeLoader },
      { path: "product/:category/:id", element: <ProductDetailPage /> },
      {
        element: <ProtectedRouteCustomer />,
        children: [
          {
            path: "users/me",
            element: <CustomerProfilePage />,
            loader: myOrdersLoader,
          },
          { path: "cart", element: <CustomerCartPage /> },
          { path: "checkout", element: <CheckoutPage /> },
          { path: "/orders/:code", element: <OrderDetailPage /> },
          { path: "/order-success", element: <OrderSuccessPage /> },
          { path: "/order-failed", element: <OrderErrorPage /> },
          { path: "/order-error", element: <OrderErrorPage /> },
        ],
      },
      {
        path: "/category/:id",
        element: <CategoryDetailPage />,
        loader: categoryDetailLoader,
      },
      {
        path: "products",
        element: <SearchPage />,
        loader: searchLoader,
      },
    ],
  },
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login/customer",
        element: <CustomerLoginPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "register/customer",
        element: <CustomerRegisterPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "reset-password",
        element: <CustomerForgotPasswordPage />,
        errorElement: <ErrorPage />,
      },
    ],
  },
  {
    path: "/reset-password/:token",
    element: <CustomerResetPasswordPage />,
  },

  {
    path: "/admin",
    element: <ProtectedRouteAdmin />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "users", element: <UsersPage /> },
          { path: "users/:id", element: <UserDetailPage /> },

          { path: "products/list", element: <ProductsPage /> },
          { path: "products/add-new", element: <AddProductPage /> },
          { path: "product/edit/:id", element: <EditProductPage /> },

          { path: "categories", element: <CategoriesPage /> },
          { path: "brands", element: <BrandsPage /> },

          { path: "orders", element: <OrdersPage /> },
          { path: "reviews", element: <ReviewsPage /> },

          { path: "promotions", element: <PromotionPage /> },
          { path: "promotions/add", element: <AddPromotionPage /> },
          { path: "promotions/:id", element: <DetailedPromotion /> },
        ],
      },
    ],
  },
  {
    path: "/admin/login",
    element: 
        <AdminLoginPage />,
    errorElement: <ErrorPage />,
  },
]);

export default router;
