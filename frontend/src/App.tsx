import React from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "./components/layouts/MainLayout";
import HomePage from "./pages/home/HomePage";
import ShowroomPage from "./pages/showRoom";

const App: React.FC = () => {
  return (
    <Routes>
      {/* Layout có Header + Footer */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="showroom" element={<ShowroomPage />} />
        {/* <Route path="/categories/:id" element={<ProductPage />} /> */}
      </Route>

      {/* Routes không dùng layout */}
      {/* <Route path="/auth/login" element={<LoginPage />} /> */}
    </Routes>
  );
};

export default App;
