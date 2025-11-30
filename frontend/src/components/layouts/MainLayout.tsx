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
    <div className="flex flex-col min-h-screen ">
      {/* 1. HEADER */}
      <Header />

      {/* 2. MAIN CONTENT */}
      <main className="flex-grow bg-gray-50 pt-16 md:pt-0 max-w-[1200px] mx-auto">
        {children}
      </main>
      {/* 3. FOOTER */}
      <Footer />
    </div>
  );
};

export default MainLayout;
