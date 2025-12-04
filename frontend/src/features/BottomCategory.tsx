import { Link } from "react-router-dom";

interface BottomCategoryProps {
  id: string;
  name: string;
  imageUrl: string;
  url: string;
}

const productCategories: BottomCategoryProps[] = [
  {
    id: "laptop",
    name: "Laptop",
    imageUrl:
      "https://file.hstatic.net/200000636033/file/icon1_ce115f32db874a8e9b5af39517176e96.png",
    url: "/categories/laptop",
  },
  {
    id: "pc",
    name: "PC",
    imageUrl: "#",
    url: "/categories/pc",
  },
  {
    id: "monitor",
    name: "Màn hình",
    imageUrl: "#",
    url: "/categories/monitor",
  },
  {
    id: "mainboard",
    name: "Mainboard",
    imageUrl: "#",
    url: "/categories/mainboard",
  },
  {
    id: "cpu",
    name: "CPU",
    imageUrl: "#",
    url: "/categories/cpu",
  },
  {
    id: "vga",
    name: "VGA",
    imageUrl: "#",
    url: "/categories/vga",
  },
  {
    id: "ram",
    name: "RAM",
    imageUrl: "#",
    url: "/categories/ram",
  },
  {
    id: "ssd",
    name: "Ổ cứng",
    imageUrl: "#",
    url: "/categories/ssd",
  },
  {
    id: "case",
    name: "Case",
    imageUrl: "#",
    url: "/categories/case",
  },
  {
    id: "cooling",
    name: "Tản nhiệt",
    imageUrl: "#",
    url: "/categories/tan-nhiet",
  },
  {
    id: "psu",
    name: "Nguồn",
    imageUrl: "#",
    url: "/categories/psu",
  },
  {
    id: "keyboard",
    name: "Bàn phím",
    imageUrl: "#",
    url: "/categories/keyboard",
  },
  {
    id: "mouse",
    name: "Chuột",
    imageUrl: "#",
    url: "/categories/mouse",
  },
  {
    id: "chair",
    name: "Ghế",
    imageUrl: "#",
    url: "/categories/chair",
  },
  {
    id: "headphone",
    name: "Tai nghe",
    imageUrl: "#",
    url: "/categories/tai-nghe",
  },
  {
    id: "speaker",
    name: "Loa",
    imageUrl: "#",
    url: "/categories/loa",
  },
  {
    id: "console",
    name: "Console",
    imageUrl: "#",
    url: "/categories/console",
  },
  {
    id: "accessory",
    name: "Phụ kiện",
    imageUrl: "#",
    url: "/categories/phu-kien",
  },
  {
    id: "office",
    name: "Thiết bị VP",
    imageUrl: "#",
    url: "/categories/thiet-bi-van-phong",
  },
  {
    id: "sac-dp",
    name: "Sạc DP",
    imageUrl: "#",
    url: "/categories/sac-dp",
  },
];

const BottomCategory: React.FC = () => {
  return (
    <div className="w-full bg-white rounded-md px-3 py-3 ">
      <div className="flex flex-col justify-between mb-4 px-1">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 uppercase border-l-4 border-red-600 pl-3 mb-10">
          Danh mục sản phẩm
        </h2>
        <div
          className="grid grid-rows-2 grid-flow-col gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide
            md:grid-cols-5 lg:grid-cols-10 md:gap-8 md:overflow-visible md:max-h-none md:grid-flow-row"
        >
          {productCategories.map((category) => (
            <Link
              to={category.url}
              key={category.id}
              className="flex-shrink-0 w-20 flex flex-col items-center justify-start snap-start md:w-auto"
            >
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-full object-contain"
              />
              <p className="text-sm text-center">{category.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomCategory;
