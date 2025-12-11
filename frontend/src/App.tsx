import React from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "./components/layouts/MainLayout";
import HomePage from "./pages/home/HomePage";
import AdminLayout from "./components/layouts/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import UsersPage from "./pages/admin/UsersPage";

const App: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />
      {/* <Route
          path="/product/:id"
          element={
            <MainLayout>
              <ProductDetailPage />
            </MainLayout>
          }
        /> */}
      <Route
        path="/admin"
        element={<AdminLayout/>}
      >
        <Route index element={<DashboardPage />} />
        {/* <Route path="products" element={<ProductsPage />} /> */}
        {/* <Route path="orders" element={<OrdersPage />} /> */}
        <Route path="customers" element={<UsersPage />} /> 
      </Route>

      {/* CÁC ROUTE KHÔNG SỬ DỤNG HEADER VÀ FOOTER (Login, 404, ...)*/}
      {/* <Route path="/auth/login/" element={<LoginPage />} /> */}

      {/* Other route... */}
    </Routes>
  );

};

export default App;
