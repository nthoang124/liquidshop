import React, { useState } from "react";
import { MapPin, Phone, Clock, Navigation, Search } from "lucide-react";

import useDocumentTitle from "@/hooks/useDocumentTitle";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// --- 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU (TYPES/INTERFACES) ---

// Định nghĩa các trạng thái có thể có của cửa hàng
type ShowroomStatus = "open" | "maintenance" | "coming_soon";

// Định nghĩa cấu trúc dữ liệu của một Showroom
interface Showroom {
  id: number;
  city: string;
  name: string;
  address: string;
  phone: string;
  time: string;
  status: ShowroomStatus;
  image: string;
  mapLink: string;
}

// --- DATA ---
const SHOWROOMS: Showroom[] = [
  {
    id: 1,
    city: "hcm",
    name: "LIQUID Store Quận 10",
    address: "123 Đường 3/2, Phường 11, Quận 10, TP. Hồ Chí Minh",
    phone: "1800 6975",
    time: "8:00 - 21:30 (Cả CN & Lễ)",
    status: "open",
    image:
      "https://file.hstatic.net/200000722513/file/showroom_quan_10_800x400.jpg",
    mapLink: "https://maps.google.com",
  },
  {
    id: 2,
    city: "hcm",
    name: "LIQUID Store Thủ Đức",
    address: "456 Võ Văn Ngân, TP. Thủ Đức, TP. Hồ Chí Minh",
    phone: "1800 6173",
    time: "8:30 - 21:00 (Cả CN & Lễ)",
    status: "open",
    image:
      "https://file.hstatic.net/200000722513/file/showroom_thu_duc_800x400.jpg",
    mapLink: "https://maps.google.com",
  },
  {
    id: 3,
    city: "hcm",
    name: "LIQUID Store Tân Bình",
    address: "789 Hoàng Văn Thụ, Phường 4, Tân Bình, TP. HCM",
    phone: "1800 6234",
    time: "8:00 - 21:30",
    status: "maintenance",
    image:
      "https://file.hstatic.net/200000722513/file/showroom_tan_binh_800x400.jpg",
    mapLink: "https://maps.google.com",
  },
  {
    id: 4,
    city: "hn",
    name: "LIQUID Store Đống Đa",
    address: "88 Thái Hà, Trung Liệt, Đống Đa, Hà Nội",
    phone: "1800 6868",
    time: "8:30 - 21:30",
    status: "open",
    image:
      "https://file.hstatic.net/200000722513/file/showroom_thai_ha_800x400.jpg",
    mapLink: "https://maps.google.com",
  },
  {
    id: 5,
    city: "hn",
    name: "LIQUID Store Cầu Giấy",
    address: "22 Xuân Thủy, Dịch Vọng Hậu, Cầu Giấy, Hà Nội",
    phone: "1800 6699",
    time: "8:00 - 21:00",
    status: "coming_soon",
    image:
      "https://file.hstatic.net/200000722513/file/showroom_cau_giay_800x400.jpg",
    mapLink: "https://maps.google.com",
  },
];

// --- 2. COMPONENT TRẠNG THÁI ---

// Định nghĩa props cho StatusBadge
interface StatusBadgeProps {
  status: ShowroomStatus | string; // Cho phép string để tránh lỗi nếu data mở rộng sau này
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case "open":
      return (
        <Badge className="bg-green-600 hover:bg-green-700">Đang mở cửa</Badge>
      );
    case "maintenance":
      return (
        <Badge variant="secondary" className="text-gray-500">
          Bảo trì
        </Badge>
      );
    case "coming_soon":
      return (
        <Badge className="bg-orange-500 hover:bg-orange-600">
          Sắp khai trương
        </Badge>
      );
    default:
      return null;
  }
};

// --- 3. TRANG CHÍNH ---
const ShowroomPage: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Logic lọc
  const filteredStores = SHOWROOMS.filter((store) => {
    const matchCity = selectedCity === "all" || store.city === selectedCity;
    const matchSearch =
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCity && matchSearch;
  });

  return (
    <>
      {useDocumentTitle("Hệ thống cửa hàng")}
      <div className="min-h-screen bg-gray-50 pb-10 mb-10">
        {/* HEADER SECTION */}
        <div className="bg-gradient-to-r from-red-600 to-black text-white py-12 mb-3 rounded-md relative z-0">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 uppercase tracking-wide">
              Hệ thống cửa hàng LIQUID
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Trải nghiệm trực tiếp các sản phẩm công nghệ đỉnh cao tại hệ thống
              cửa hàng trên toàn quốc. Đội ngũ tư vấn chuyên nghiệp luôn sẵn
              sàng hỗ trợ bạn.
            </p>
          </div>
        </div>

        {/* FILTER & SEARCH SECTION */}
        <div className="max-w-7xl mx-auto px-4 relative z-20">
          <Card className="p-4 shadow-lg border-none">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Filter by cities */}
              <div className="w-full md:w-[200px]">
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="h-11 w-full md:w-[200px]">
                    <SelectValue placeholder="Chọn khu vực" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">Tất cả khu vực</SelectItem>
                    <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                    <SelectItem value="hn">Hà Nội</SelectItem>
                    <SelectItem value="dn">Đà Nẵng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tên đường, quận huyện..."
                  className="pl-10 h-11 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.target.value)
                  }
                />
              </div>

              <Button className="h-11 bg-red-600 text-white hover:bg-red-700 px-8 font-semibold">
                TÌM CỬA HÀNG
              </Button>
            </div>
          </Card>
        </div>

        {/* STORE LIST SECTION */}
        <div className="max-w-7xl mx-auto px-4 mt-10">
          {/* Tiêu đề kết quả */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <MapPin className="text-red-600" />
              Danh sách cửa hàng ({filteredStores.length})
            </h2>
          </div>

          {filteredStores.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStores.map((store) => (
                <Card
                  key={store.id}
                  className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-gray-200"
                >
                  {/* Ảnh cửa hàng */}
                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    <img
                      src={
                        store.image ||
                        "https://via.placeholder.com/800x400?text=Showroom+LIQUID"
                      }
                      alt={store.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3">
                      <StatusBadge status={store.status} />
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                      {store.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3 text-sm text-gray-600 pb-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{store.address}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                      <span className="font-semibold text-black">
                        {store.phone}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400 shrink-0" />
                      <span>{store.time}</span>
                    </div>
                  </CardContent>

                  <Separator />

                  <CardFooter className="pt-4 gap-3 bg-gray-50/50">
                    <Button
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white gap-2"
                      asChild
                    >
                      <a href={`tel:${store.phone.replace(/\s/g, "")}`}>
                        <Phone className="w-4 h-4" /> Gọi ngay
                      </a>
                    </Button>

                    <Button
                      variant="outline"
                      className="flex-1 border-gray-300 hover:border-red-500 hover:text-red-500 gap-2"
                      asChild
                    >
                      <a href={store.mapLink} target="_blank" rel="noreferrer">
                        <Navigation className="w-4 h-4" /> Chỉ đường
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">
                Không tìm thấy cửa hàng nào
              </h3>
              <p className="text-gray-500">
                Vui lòng thử tìm kiếm với từ khóa hoặc khu vực khác.
              </p>
            </div>
          )}
        </div>

        {/* GOOGLE MAP SECTION */}
        <div className="max-w-7xl mx-auto px-4 mt-16">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-lg mb-4">Bản đồ hệ thống</h3>
            <div className="w-full h-[400px] bg-gray-200 rounded-md flex items-center justify-center text-gray-500 relative overflow-hidden">
              {/* Nhúng iframe Google Map */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.424227847976!2d106.6876523748047!3d10.778783289371077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3a9d97282b%3A0x45e221d6e87f3202!2zMTIzIMSQLiAzIFRo4bqpbHcgMiwgUGjGsOG7nW5nIDExLCBRdWFuIDEwLCBI4buTIENow60gTWluaCwgVmlldG5hbQ!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Liquid Map"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowroomPage;
