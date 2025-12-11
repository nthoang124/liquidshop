import React from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { Outlet } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

interface MainLayoutProps {
  children?: React.ReactNode;
}

const PageLoader = () => (
  <div className="p-4 space-y-4">
    <Skeleton className="h-[200px] w-full rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  </div>
);

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      <Header />

      <main className="grow bg-[#ececec] w-full">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <Suspense fallback={<PageLoader />}>
            {children ?? <Outlet />}
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
