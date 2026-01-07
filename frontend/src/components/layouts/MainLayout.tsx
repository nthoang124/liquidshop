import React, { Suspense, useEffect } from "react";
import { useNavigation } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { Outlet } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "sonner";
import ScrollToTop from "../common/ScrollToTop";
import ChatBot from "../chatbot/ChatBot";
import Zalo from "../common/Zalo";
import SideBanner from "../common/SideBanner";

import mainBG from "@/assets/images/main-bg.jpg";

import nProgress from "nprogress";

nProgress.configure({
  showSpinner: false,
  speed: 400,
  minimum: 0.2,
});

const PageLoader = () => (
  <div className="p-4 space-y-4">
    <Skeleton className="h-[200px] w-full rounded-xl bg-zinc-800" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px] bg-zinc-800" />
      <Skeleton className="h-4 w-[200px] bg-zinc-800" />
    </div>
  </div>
);

const MainLayout: React.FC = () => {
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === "loading") {
      nProgress.start();
    } else {
      nProgress.done();
    }
  }, [navigation.state]);
  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0 bg-[#0a0a0a]">
      <ScrollToTop />
      <Header />

      <SideBanner
        position="left"
        imgSrc="https://cdn.hstatic.net/files/200000722513/file/gearvn-pc-gvn-sticky-t1-26.png"
      />
      <SideBanner
        position="right"
        imgSrc="https://cdn.hstatic.net/files/200000722513/file/gearvn-laptop-gaming-sticky-t1-26.png"
      />

      <main
        className="grow relative bg-cover bg-center bg-fixed w-full"
        style={{
          backgroundImage: `url(${mainBG})`,
        }}
      >
        <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </div>
      </main>

      <Footer />
      <ChatBot />
      <Zalo />
      <Toaster theme="dark" position="top-center" richColors />
    </div>
  );
};

export default MainLayout;
