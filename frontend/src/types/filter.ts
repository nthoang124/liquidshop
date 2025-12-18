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
      ],
    },
    {
      label: "Ổ cứng",
      key: "specifications.storage",
      options: [
        { label: "256GB SSD", value: "256GB SSD" },
        { label: "512GB SSD", value: "512GB SSD" },
        { label: "1TB SSD", value: "1TB SSD" },
      ],
    },
  ],
  "Điện thoại": [
    {
      label: "Dung lượng",
      key: "specifications.storage",
      options: [
        { label: "128GB", value: "128GB" },
        { label: "256GB", value: "256GB" },
        { label: "512GB", value: "512GB" },
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
