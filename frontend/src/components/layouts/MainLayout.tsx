import React from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";

// --- 1. DEFINE TYPESCRIPT FOR PROPS ---
interface MainLayoutProps {
  children: React.ReactNode;
}

// --- 2. COMPONENT MAINLAYOUT ---
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HEADER */}
      <Header />

      {/* 2. MAIN CONTENT */}
      {/* flex-grow giúp nội dung chính chiếm hết không gian còn lại */}
      <main className="flex-grow bg-gray-50 dark:bg-[#151517] pt-16 md:pt-0">
        {/*
          Thẻ 'children' là nội dung của trang hiện tại 
        */}
        {children}
      </main>
      {/* 3. FOOTER */}
      <Footer />
    </div>
  );
};

export default MainLayout;
