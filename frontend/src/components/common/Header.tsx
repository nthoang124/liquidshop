import React from "react";
import { Link } from "react-router-dom";
import {
  User,
  ShoppingCart,
  Home,
  MessageSquare,
  Search,
  MapPin,
  Phone,
  FileText,
} from "lucide-react";

import logo from "../../assets/icons/TL-Logo.png";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// --- TYPES ---
interface CartBadgeProps {
  count: number;
  children: React.ReactNode;
}

const Header: React.FC = () => {
  // Logo Component nội bộ
  const Logo = () => (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 overflow-hidden flex-shrink-0">
        <img src={logo} alt="logo" className="w-full h-full object-contain" />
      </div>
      <div className="hidden md:flex flex-col leading-tight">
        <span className="text-base font-bold tracking-wider bg-gradient-to-r from-red-500 via-gray-400 to-red-500 bg-clip-text text-transparent font-logo">
          LIQUID
        </span>
        <span className="font-semibold text-slate-300 font-logo">SHOP</span>
      </div>
    </div>
  );

  // Component hiển thị số lượng giỏ hàng (Custom Badge)
  const CartBadge: React.FC<CartBadgeProps> = ({ count, children }) => (
    <div className="relative inline-block">
      {children}
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#151517]">
          {count}
        </span>
      )}
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-50 shadow-md bg-[#151517] text-white md:mb-5">
        {/* --- MOBILE LAYOUT --- */}
        <div className="md:hidden px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <Logo />
            </Link>

            {/* Input Search Mobile */}
            <div className="relative flex-1">
              <Input
                placeholder="Tìm kiếm..."
                className="bg-white text-black pr-8 h-9 rounded-lg focus-visible:ring-red-500"
              />
              <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            <CartBadge count={3}>
              <Link to="/cart">
                <ShoppingCart className="h-6 w-6 text-white hover:text-red-500 transition-all" />
              </Link>
            </CartBadge>
          </div>
        </div>

        {/* --- BOTTOM NAVIGATION (mobile) --- */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#151517] border-t border-gray-700 z-50">
          <div className="flex items-center justify-around px-2 py-3 text-white">
            <Link to="/" className="flex flex-col items-center gap-1 flex-1">
              <Home className="h-6 w-6" />
              <span className="text-[10px]">Trang chủ</span>
            </Link>

            <Link
              to="/contact"
              className="flex flex-col items-center gap-1 flex-1"
            >
              <MessageSquare className="h-6 w-6" />
              <span className="text-[10px]">Tư vấn</span>
            </Link>

            {/* Logic Mobile User: */}
            <Link
              to="/auth/login/customer"
              className="flex flex-col items-center gap-1 flex-1"
            >
              <User className="h-6 w-6" />
              <span className="text-[10px] truncate max-w-[60px]">
                Tài khoản
              </span>
            </Link>
          </div>
        </nav>

        {/* --- DESKTOP LAYOUT --- */}
        <div className="hidden md:block px-4 sm:px-6 lg:px-10 py-3">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="flex items-center gap-2">
              <Logo />
            </Link>

            {/* Desktop Search */}
            <div className="flex-1 max-w-xl mx-6 relative">
              <Input
                placeholder="Bạn cần tìm gì?"
                className="bg-white text-black h-10 rounded-md pr-10 focus-visible:ring-2 focus-visible:ring-red-500"
              />
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </div>

            <div className="flex items-center gap-6">
              <nav className="flex items-center gap-8">
                <a
                  href="tel:19001009"
                  className="flex items-center group transition-colors duration-200 text-white"
                >
                  <Phone className="h-5 w-5 mb-1 mr-2 group-hover:text-red-500 transition-colors" />
                  <span className="group-hover:text-red-500 transition-colors text-xs font-semibold leading-tight">
                    Hotline <br /> 1900 1009
                  </span>
                </a>

                <Link
                  to="/showroom"
                  className="flex items-center group transition-colors duration-200 text-white"
                >
                  <MapPin className="h-5 w-5 mb-1 mr-2 group-hover:text-red-500 transition-colors" />
                  <span className="group-hover:text-red-500 transition-colors text-xs font-semibold leading-tight">
                    Hệ thống
                    <br />
                    Showroom
                  </span>
                </Link>

                <Link
                  to="/order/lookup"
                  className="flex items-center group transition-colors duration-200 text-white"
                >
                  <FileText className="h-5 w-5 mb-1 mr-2 group-hover:text-red-500 transition-colors" />
                  <span className="group-hover:text-red-500 transition-colors text-xs font-semibold leading-tight">
                    Tra cứu <br /> đơn hàng
                  </span>
                </Link>
              </nav>

              <CartBadge count={2}>
                <Link to="/cart">
                  <ShoppingCart className="h-7 w-7 text-white hover:text-red-500 transition-all" />
                </Link>
              </CartBadge>

              {/* PHẦN LOGIN */}
              <Link to="/auth/login/customer">
                <Button
                  variant="outline"
                  className="h-auto py-2 px-3 bg-transparent border-2 border-white text-white hover:border-red-500 hover:text-red-500 hover:bg-transparent flex items-center gap-2 cursor-pointer"
                >
                  <User className="h-5 w-5" />
                  <span className="text-xs font-semibold text-left leading-tight">
                    Đăng <br /> nhập
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
