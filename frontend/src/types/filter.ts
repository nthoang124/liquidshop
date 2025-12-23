export interface IFilterOption {
  label: string;
  value: string;
}

export interface IFilterGroup {
  label: string;
  key: string;
  options: IFilterOption[];
}

export const FILTER_CONFIG: Record<string, IFilterGroup[]> = {
  Laptop: [
    {
      label: "CPU",
      key: "specifications.cpu",
      options: [
        { label: "Intel Core i5", value: "Intel Core i5" },
        { label: "Intel Core i7", value: "Intel Core i7" },
        { label: "Intel Core i9", value: "Intel Core i9" },
        { label: "AMD Ryzen 5", value: "AMD Ryzen 5" },
        { label: "AMD Ryzen 7", value: "AMD Ryzen 7" },
        { label: "Apple M1", value: "Apple M1" },
        { label: "Apple M2", value: "Apple M2" },
      ],
    },
    {
      label: "RAM",
      key: "specifications.ram",
      options: [
        { label: "8GB", value: "8GB" },
        { label: "16GB", value: "16GB" },
        { label: "32GB", value: "32GB" },
        { label: "64GB", value: "64GB" },
      ],
    },
    {
      label: "Ổ cứng",
      key: "specifications.storage",
      options: [
        { label: "256GB SSD", value: "256GB SSD" },
        { label: "512GB SSD", value: "512GB SSD" },
        { label: "1TB SSD", value: "1TB SSD" },
        { label: "2TB SSD", value: "2TB SSD" },
      ],
    },
    {
      label: "Màn hình",
      key: "specifications.screen",
      options: [
        { label: "13 inch", value: "13 inch" },
        { label: "14 inch", value: "14 inch" },
        { label: "15.6 inch", value: "15.6 inch" },
        { label: "16 inch", value: "16 inch" },
      ],
    },
  ],

  "Điện thoại": [
    {
      label: "Dung lượng",
      key: "specifications.storage",
      options: [
        { label: "64GB", value: "64GB" },
        { label: "128GB", value: "128GB" },
        { label: "256GB", value: "256GB" },
        { label: "512GB", value: "512GB" },
      ],
    },
    {
      label: "RAM",
      key: "specifications.ram",
      options: [
        { label: "4GB", value: "4GB" },
        { label: "6GB", value: "6GB" },
        { label: "8GB", value: "8GB" },
        { label: "12GB", value: "12GB" },
      ],
    },
  ],

  "Tai nghe": [
    {
      label: "Loại tai nghe",
      key: "specifications.type",
      options: [
        { label: "True Wireless", value: "True Wireless" },
        { label: "Over-ear", value: "Over-ear" },
        { label: "On-ear", value: "On-ear" },
        { label: "In-ear", value: "In-ear" },
      ],
    },
    {
      label: "Kết nối",
      key: "specifications.connection",
      options: [
        { label: "Bluetooth", value: "Bluetooth" },
        { label: "Có dây", value: "Wired" },
        { label: "Bluetooth + Jack 3.5mm", value: "Hybrid" },
      ],
    },
    {
      label: "Chống ồn",
      key: "specifications.noiseCancellation",
      options: [
        { label: "Có ANC", value: "ANC" },
        { label: "Không", value: "None" },
      ],
    },
  ],
  Chuột: [
    {
      label: "Loại chuột",
      key: "specifications.type",
      options: [
        { label: "Gaming", value: "Gaming" },
        { label: "Văn phòng", value: "Office" },
        { label: "Công thái học", value: "Ergonomic" },
      ],
    },
    {
      label: "Kết nối",
      key: "specifications.connection",
      options: [
        { label: "Có dây", value: "Wired" },
        { label: "Không dây", value: "Wireless" },
        { label: "Bluetooth", value: "Bluetooth" },
      ],
    },
    {
      label: "DPI",
      key: "specifications.dpi",
      options: [
        { label: "800 DPI", value: "800" },
        { label: "1600 DPI", value: "1600" },
        { label: "3200 DPI", value: "3200" },
        { label: "6400 DPI", value: "6400" },
      ],
    },
  ],
  "Bàn phím": [
    {
      label: "Loại bàn phím",
      key: "specifications.type",
      options: [
        { label: "Cơ", value: "Mechanical" },
        { label: "Giả cơ", value: "Membrane" },
      ],
    },
    {
      label: "Switch",
      key: "specifications.switch",
      options: [
        { label: "Blue Switch", value: "Blue" },
        { label: "Red Switch", value: "Red" },
        { label: "Brown Switch", value: "Brown" },
        { label: "Optical Switch", value: "Optical" },
      ],
    },
    {
      label: "Kết nối",
      key: "specifications.connection",
      options: [
        { label: "Có dây", value: "Wired" },
        { label: "Bluetooth", value: "Bluetooth" },
        { label: "2.4GHz Wireless", value: "2.4GHz" },
      ],
    },
    {
      label: "Layout",
      key: "specifications.layout",
      options: [
        { label: "Full size", value: "Full size" },
        { label: "TKL (87 phím)", value: "TKL" },
        { label: "75%", value: "75%" },
        { label: "60%", value: "60%" },
      ],
    },
  ],

  default: [],
};

/**
 * Lấy danh sách bộ lọc dựa trên tên danh mục.
 * Ví dụ: "Laptop Gaming" sẽ khớp với key "Laptop" trong config.
 */
export const getFiltersForCategory = (categoryName: string): IFilterGroup[] => {
  if (!categoryName) return [];

  const configKey = Object.keys(FILTER_CONFIG).find(
    (key) =>
      categoryName.toLowerCase().includes(key.toLowerCase()) &&
      key !== "default"
  );

  return configKey ? FILTER_CONFIG[configKey] : FILTER_CONFIG["default"] || [];
};

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Laptop: [
    "laptop",
    "macbook",
    "dell",
    "asus",
    "hp",
    "acer",
    "lenovo",
    "msi",
    "thinkpad",
  ],
  "Điện thoại": [
    "điện thoại",
    "smartphone",
    "iphone",
    "samsung",
    "galaxy",
    "xiaomi",
    "oppo",
    "redmi",
  ],
  Chuột: ["chuột", "mouse", "logitech", "razer"],
  "Bàn phím": ["bàn phím", "phím", "keyboard", "akko", "keychron"],
  "Tai nghe": ["tai nghe", "headphone", "HyperX", "Razer"],
  // Thêm các danh mục khác tùy ý...
};

export const detectCategoryFromKeyword = (keyword: string): string => {
  if (!keyword) return "";
  const lowerKeyword = keyword.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((k) => lowerKeyword.includes(k))) {
      return category;
    }
  }
  return "";
};
