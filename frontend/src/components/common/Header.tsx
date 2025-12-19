import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  ShoppingCart,
  Home,
  MessageSquare,
  Phone,
  FileText,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import logo from "../../assets/icons/TL-Logo.png";

import { useAuth } from "@/context/CustomerAuthContext";
import { useCart } from "@/context/CartContext";

import CategoryDesktop from "../product/filter/categoryDesktop";
import CategoryMobile from "../product/filter/categoryMobile";
import SearchBar from "../product/searchBar";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  const navigate = useNavigate();

  const getFirstLetter = (name?: string) => {
    return name ? name.charAt(0).toUpperCase() : "@";
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const UserDropdown = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="h-10 w-10 border-2 border-white cursor-pointer hover:scale-105 transition-transform shadow-sm">
            <AvatarImage
              src={user?.avatarUrl}
              alt={user?.fullName}
              className="object-cover"
            />
            <AvatarFallback className="bg-red-600 text-white font-bold">
              {getFirstLetter(user?.fullName)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-56 bg-[#151517] border border-gray-700 text-white shadow-xl"
          align="end"
        >
          <DropdownMenuLabel className="p-2">
            <p className="text-sm text-white font-bold truncate">
              {user?.fullName}
            </p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-gray-700" />

          <DropdownMenuItem
            className="p-2 cursor-pointer hover:bg-gray-800 focus:bg-gray-800"
            asChild
          >
            <Link to="/users/me" className="flex items-center gap-3 ">
              <User className="w-4 h-4 text-gray-300" />
              <span className="text-white">Tài khoản của tôi</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="p-2 cursor-pointer text-red-500 hover:bg-gray-800 focus:bg-gray-800 focus:text-red-400"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const Logo = () => (
    <div className="flex items-center gap-2 select-none">
      <div className="w-10 h-10 overflow-hidden flex-shrink-0">
        <img src={logo} alt="logo" className="w-full h-full object-contain" />
      </div>
      <div className="hidden md:flex flex-col leading-tight">
        <span className="text-base font-bold tracking-wider bg-gradient-to-r from-red-500 via-gray-400 to-red-500 bg-clip-text text-transparent font-logo">
          LIQUID
        </span>
      </div>
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-50 shadow-md bg-[#151517] text-white">
        {/* --- MOBILE LAYOUT --- */}
        <div className="md:hidden px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <Logo />
            </Link>

            {/* Input Search Mobile */}

            <SearchBar placeholder="Tìm kiếm..." />

            <Link to="/cart" className="relative group">
              <ShoppingCart className="h-7 w-7 text-white group-hover:text-red-500 transition-all" />

              {cartCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold rounded-full border-2 border-[#151517]"
                >
                  {cartCount}
                </Badge>
              )}
            </Link>
          </div>
        </div>

        {/* --- BOTTOM NAVIGATION (mobile) --- */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#151517] border-t border-gray-700 z-50">
          <div className="flex items-center justify-around px-2 py-3 text-white">
            <Link to="/" className="flex flex-col items-center gap-1 flex-1">
              <Home className="h-6 w-6" />
              <span className="text-[10px]">Trang chủ</span>
            </Link>

            <CategoryMobile />

            <Link
              to="/contact"
              className="flex flex-col items-center gap-1 flex-1"
            >
              <MessageSquare className="h-6 w-6" />
              <span className="text-[10px]">Tư vấn</span>
            </Link>

            {/* Logic Mobile User: */}
            <Link
              to={user ? "/users/me" : "/auth/login/customer"}
              className="flex flex-col items-center gap-1 flex-1"
            >
              {user ? (
                <Avatar className="h-6 w-6 border border-white">
                  <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                  <AvatarFallback className="bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {getFirstLetter(user.fullName)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <User className="h-6 w-6" />
              )}
              <span className="text-[10px] truncate max-w-[60px]">
                {user ? "Tôi" : "Tài khoản"}
              </span>
            </Link>
          </div>
        </nav>

        {/* --- DESKTOP LAYOUT --- */}
        <div className="hidden md:block px-4 sm:px-6 lg:px-10 py-3">
          <div className="flex items-center justify-between justify-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <Logo />
            </Link>

            <CategoryDesktop />

            {/* Desktop Search */}
            <SearchBar />

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
                  to="/users/me#orders-history"
                  className="flex items-center group transition-colors duration-200 text-white"
                >
                  <FileText className="h-5 w-5 mb-1 mr-2 group-hover:text-red-500 transition-colors" />
                  <span className="group-hover:text-red-500 transition-colors text-xs font-semibold leading-tight">
                    Tra cứu <br /> đơn hàng
                  </span>
                </Link>
              </nav>

              <Link to="/cart" className="relative group">
                <ShoppingCart className="h-7 w-7 text-white group-hover:text-red-500 transition-all" />

                {cartCount >= 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 px-1.5 pt-1.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold rounded-full border-2 border-[#151517]"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Link>

              {/* PHẦN LOGIN */}
              {user ? (
                <UserDropdown />
              ) : (
                <Link to="auth/login/customer">
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
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
