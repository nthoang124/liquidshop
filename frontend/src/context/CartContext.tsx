// context/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { cartService } from "@/services/api/customer/cart.service";
import { useAuth } from "./CustomerAuthContext";

interface CartContextType {
  cartCount: number;
  updateCartCount: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  const updateCartCount = async () => {
    if (!user) {
      setCartCount(0);
      return;
    }
    try {
      const res: any = await cartService.getCart();
      if (res && res.cart) {
        const totalItems = res.cart.items.reduce(
          (acc: number, item: any) => acc + item.quantity,
          0
        );
        setCartCount(totalItems);
      }
    } catch (error) {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
  }, [user]);

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
