import React from "react";
import { Link } from "react-router-dom";
import { Phone, Facebook, Youtube, Instagram, QrCode } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Sử dụng React.FC để định nghĩa loại (type) cho Functional Component
const Footer: React.FC = () => {
  const generalPolicies = [
    { name: "Chính sách bảo hành", href: "/policy/warranty" },
    { name: "Chính sách đổi trả", href: "/policy/return" },
    { name: "Chính sách bảo mật", href: "/policy/privacy" },
    { name: "Chính sách vận chuyển", href: "/policy/shipping" },
    { name: "Hướng dẫn thanh toán", href: "/guide/payment" },
    { name: "Kiểm tra hóa đơn điện tử", href: "/check/invoice" },
  ];

  const infoLinks = [
    { name: "Hệ thống cửa hàng", href: "/showroom" },
    { name: "Tuyển dụng", href: "/careers" },
    { name: "Tin công nghệ", href: "/news" },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 pt-10">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-gray-900 text-lg mb-4 uppercase">
              Về LiquidShop
            </h4>
            <p className="text-sm text-gray-500 mb-4 text-justify">
              LiquidShop là hệ thống bán lẻ máy tính và phụ kiện gaming hàng đầu
              Việt Nam, cam kết mang đến những trải nghiệm tốt nhất cho game
              thủ.
            </p>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-600">
                  Gọi mua hàng:
                </p>
                <a
                  href="tel:18006975"
                  className="text-lg font-bold text-red-600 hover:underline flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" /> 1800 6975
                </a>
                <p className="text-xs text-gray-400">(8:30 - 21:30)</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">
                  Hỗ trợ kỹ thuật:
                </p>
                <a
                  href="tel:18006173"
                  className="text-lg font-bold text-gray-800 hover:text-red-600 transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" /> 1800 6173
                </a>
                <p className="text-xs text-gray-400">(8:30 - 21:30)</p>
              </div>
            </div>
          </div>

          {/* CHÍNH SÁCH */}
          <div>
            <h4 className="font-bold text-gray-900 text-lg mb-4 uppercase">
              Chính sách chung
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {generalPolicies.map((item) => (
                <li key={item.name}>
                  {/* Sử dụng Link cho điều hướng nội bộ */}
                  <Link
                    to={item.href}
                    className="hover:text-red-600 hover:underline transition-colors block py-1"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* THÔNG TIN & THANH TOÁN */}
          <div>
            <h4 className="font-bold text-gray-900 text-lg mb-4 uppercase">
              Thông tin
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              {infoLinks.map((item) => (
                <li key={item.name}>
                  {/* Sử dụng Link cho điều hướng nội bộ */}
                  <Link
                    to={item.href}
                    className="hover:text-red-600 block py-1"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="font-bold text-gray-900 text-sm mb-3 uppercase">
              Thanh toán
            </h4>
            <div className="flex flex-wrap gap-2">
              <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-[8px] font-bold">
                VISA
              </div>
              <div className="w-10 h-6 bg-orange-500 rounded flex items-center justify-center text-white text-[8px] font-bold">
                MC
              </div>
              <div className="w-10 h-6 bg-pink-600 rounded flex items-center justify-center text-white text-[8px] font-bold">
                MOMO
              </div>
              <div className="w-10 h-6 bg-blue-400 rounded flex items-center justify-center text-white text-[8px] font-bold">
                VNPAY
              </div>
            </div>
          </div>

          {/* KẾT NỐI & CHỨNG NHẬN */}
          <div>
            <h4 className="font-bold text-gray-900 text-lg mb-4 uppercase">
              Kết nối với chúng tôi
            </h4>
            <div className="flex gap-3 mb-6">
              <Button
                size="icon"
                variant="outline"
                className="rounded-full border-gray-300 text-gray-600 hover:bg-blue-600 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="rounded-full border-gray-300 text-gray-600 hover:bg-red-600 hover:text-white transition-colors"
                aria-label="Youtube"
              >
                <Youtube className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="rounded-full border-gray-300 text-gray-600 hover:bg-pink-600 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </Button>
            </div>

            <h4 className="font-bold text-gray-900 text-sm mb-3 uppercase">
              Chứng nhận
            </h4>
            <div className="flex gap-4 items-center">
              <div className="w-32 h-12 bg-contain bg-no-repeat bg-center bg-[url('https://webmedia.com.vn/images/2021/09/logo-da-thong-bao-bo-cong-thuong-mau-xanh.png')]"></div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-100">
              <div className="flex items-center gap-2 mb-1 text-xs font-bold text-gray-700">
                <QrCode className="w-4 h-4" /> Quét mã tư vấn
              </div>
              <p className="text-[10px] text-gray-500">
                Zalo OA chính thức của LiquidShop
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* --- BOTTOM COPYRIGHT --- */}
        <div className="pb-8 text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500">
            <div>
              <p className="font-bold text-gray-700 mb-1">
                CÔNG TY TNHH THƯƠNG MẠI TEAM LIQUID
              </p>
              <p className="mb-1">
                Địa chỉ: 276-278 Hoàng Văn Thụ, Phường 4, Quận Tân Bình, TP. HCM
              </p>
              <p>Mã số thuế: 0313883xxx do Sở Kế hoạch và Đầu tư TP.HCM cấp</p>
            </div>
            <div className="md:text-right flex flex-col justify-end">
              <p>© 2025 LiquidShop. All rights reserved.</p>
              <p>Designed by March7th</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
