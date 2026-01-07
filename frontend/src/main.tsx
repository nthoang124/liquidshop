import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router.tsx";
import { AuthProvider } from "./context/CustomerAuthContext.tsx";
import { CartProvider } from "./context/CartContext.tsx";
import { Toaster } from "@/components/ui/sonner";
import { AdminAuthProvider } from "./context/AdminAuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AdminAuthProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster richColors position="top-right" />
          <RouterProvider router={router} />
        </CartProvider> 
      </AuthProvider>
    </AdminAuthProvider>
  </StrictMode>
);
