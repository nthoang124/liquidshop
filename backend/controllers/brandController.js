const Brand = require("../models/brandModel");
const Product = require("../models/productModel")
const mongoose = require('mongoose')

const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: brands.length,
      data: brands,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error server",
      error: error.message,
    });
  }
};

const getBrandsByCategory = async (req, res) => {
  try {
    const categoryId = new mongoose.Types.ObjectId(req.params.categoryId);

    const brands = await Product.aggregate([
      { $match: { category: categoryId } },
      { $group: { _id: "$brand" } },
      {
        $lookup: {
          from: "brands",
          localField: "_id",
          foreignField: "_id",
          as: "brandInfo"
        }
      },
      { $unwind: "$brandInfo" },
      { $replaceRoot: { newRoot: "$brandInfo" } }
    ]);

    res.status(200).json(
      {
        message: "Get brands by category successful",
        brands
      });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAllBrands,
  getBrandsByCategory
};
