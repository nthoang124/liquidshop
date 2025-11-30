import React from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "./components/layouts/MainLayout";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout></MainLayout>} />
      {/* <Route
          path="/product/:id"
          element={
            <MainLayout>
              <ProductDetailPage />
            </MainLayout>
          }
        /> */}

      {/* CÁC ROUTE KHÔNG SỬ DỤNG HEADER VÀ FOOTER (Login, 404, ...)*/}
      {/* <Route path="/auth/login/" element={<LoginPage />} /> */}

      {/* Other route... */}
    </Routes>
  );
};

export default App;
