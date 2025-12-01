const mongoose = require("mongoose")

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true, index: true }, // index để tìm kiếm  
    sku: { type: String, unique: true, required: true }, // Mã sản phẩm  
    description: { type: String }, // Mô tả ngắn  
    detailedInfo: { type: String }, // Mô tả chi tiết, có thể là HTML  
    price: { type: Number, required: true }, // Giá bán hiện tại  
    originalPrice: { type: Number }, // Giá gốc (khi có khuyến mãi)  
    stockQuantity: { type: Number, required: true, default: 0 }, // Số lượng tồn kho  
    images: [
      { type: String } // Mảng các URL hình ảnh  
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand"
    },
    specifications: { type: Object }, // Đối tượng linh hoạt cho thông số kỹ thuật  
    // Ví dụ: { cpu: Intel Core i5, ram: 16GB DDR4, storage: 512GB SSD }
    status: { type: String, enum: ['active', 'inactive', 'out_of_stock'], default: 'active' },//Trạng thái của sản phầm
    tags: [{ type: String, index: true }], // Hỗ trợ tìm kiếm  
    averageRating: { type: Number, default: 0 }, // Điểm đánh giá trung bình  
    reviewCount: { type: Number, default: 0 }, // Tổng số lượt đánh giá  
    soldCount: { type: Number, default: 0 }, // Số lượng đã bán (hỗ trợ thống kê)  
  }, { timestamps: true }
)

const Product = mongoose.model("Product", productSchema)

module.exports = Product