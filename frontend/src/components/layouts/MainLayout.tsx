import React from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { Outlet } from "react-router-dom";

// --- 2. COMPONENT MAINLAYOUT ---
const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-[#ececec] pt-2 md:pt-0 w-full">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
