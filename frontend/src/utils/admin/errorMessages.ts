const CATEGORY_ERROR_MESSAGES: Record<string, string> = {
  "Category name is required": "Tên danh mục không được để trống",
  "Parent category does not exist": "Danh mục cha không tồn tại",
  "Category name already exists": "Tên danh mục đã tồn tại",
  "Error server": "lỗi hệ thống",
};

const PRODUCT_ERROR_MESSAGES: Record<string, string> = {
  "Product SKU already exists": "Mã SKU của sản phẩm đã tồn tại",
  "Name, SKU, price, stockQuantity, and category are required": "Tên, SKU, giá, số lượng tồn kho và danh mục là bắt buộc",
  "Product not found": "Không tìm thấy sản phẩm",
  "SKU already exists": "SKU đã được sử dụng",
};

const BRAND_ERROR_MESSAGES: Record<string, string> = {
    "Brand name is required": "Tên thương hiệu không được để trống",
    "Brand name already exists": "Thương hiệu đã tồn tại",
}

export {CATEGORY_ERROR_MESSAGES, PRODUCT_ERROR_MESSAGES, BRAND_ERROR_MESSAGES}