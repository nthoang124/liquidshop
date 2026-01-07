class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  async search() {
    if (!this.queryString.keyword) return this;

    const keyword = this.queryString.keyword;
    const Brand = require("../models/brandModel");
    const Category = require("../models/categoryModel");

    const brands = await Brand.find({
      name: { $regex: keyword, $options: "i" },
    }).select("_id");

    const categories = await Category.find({
      name: { $regex: keyword, $options: "i" },
    }).select("_id");

    this.query = this.query.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { brand: { $in: brands.map((b) => b._id) } },
        { category: { $in: categories.map((c) => c._id) } },
      ],
    });

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    // Mặc định nếu Frontend không thêm page và limit thì t cho lấy 10 data đầu tiên
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;

// Cái này t làm dùng để tái sử dụng nếu có sài phân trang hay filter,sort,search hay field các kiểu