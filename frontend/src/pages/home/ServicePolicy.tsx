import { Truck, ShieldCheck, RotateCcw, Headset } from "lucide-react";

const policies = [
  {
    icon: Truck,
    title: "Vận chuyển miễn phí",
    desc: "Cho đơn hàng từ 500k",
  },
  {
    icon: ShieldCheck,
    title: "Bảo hành chính hãng",
    desc: "100% sản phẩm Apple, Dell...",
  },
  {
    icon: RotateCcw,
    title: "Đổi trả dễ dàng",
    desc: "1 đổi 1 trong 15 ngày",
  },
  {
    icon: Headset,
    title: "Hỗ trợ 24/7",
    desc: "Tư vấn kỹ thuật trọn đời",
  },
];

const ServicePolicy = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 rounded-md shadow-sm">
      {policies.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-2 border border-transparent hover:border-gray-100 rounded-lg transition-all"
        >
          <item.icon className="w-8 h-8 text-red-600" />
          <div>
            <h4 className="font-bold text-sm text-gray-800">{item.title}</h4>
            <p className="text-xs text-gray-500">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServicePolicy;
