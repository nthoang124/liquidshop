
const Product = require("../models/productModel")
const Category = require('../models/categoryModel')
const Brand = require('../models/brandModel')
const APIFeatures = require('../utils/APIFeatures')

const getAllProducts = async (req, res) => {
  try {
    let filterObj = { ...req.query };

    if (req.query.brand) {
      const brand = await Brand.findOne({ name: req.query.brand })
      if (brand) {
        filterObj.brand = brand._id
      }
      else {
        return res.status(404).json({
          message: "Brand not match",
        })
      }
    }

    if (req.query.category) {
      const category = await Category.findOne({ name: req.query.category })
      if (category) {
        filterObj.category = category._id
      }
      else {
        return res.status(404).json({
          message: "Category not match",
        })
      }
    }

    const features = new APIFeatures(Product.find(), filterObj)
    await features.filter().search()
    features.sort().limitFields().paginate()

    const products = await features.query
      .populate("category", "name")
      .populate("brand", "name");

    const countFeatures = new APIFeatures(Product.find(), filterObj)
    await countFeatures.filter().search();

    const totalProduct = await countFeatures.query.countDocuments();

    res.status(200).json({
      message: 'Get products successful',
      results: products.length,
      pagination: {
        total: totalProduct,
        page: req.query.page * 1 || 1,
        limit: req.query.limit * 1 || 10,
        totalPage: Math.ceil(totalProduct / (req.query.limit * 1 || 10))
      },
      data: {
        products
      }
    });
  }
  catch (error) {
    res.status(500).json({
      message: "Can not get products",
      error: error
    })
  }
}

module.exports = { getAllProducts }