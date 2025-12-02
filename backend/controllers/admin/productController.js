const Product = require("../../models/productModel");
const Category = require("../../models/categoryModel");
const Brand = require("../../models/brandModel");
const mongoose = require("mongoose");

// [Post] - admin - create product
const createProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      description,
      detailedInfo,
      price,
      originalPrice,
      stockQuantity,
      images,
      category,
      brand,
      specifications,
      status,
      tags,
    } = req.body;

    if (!name || !sku || !price || !stockQuantity || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, SKU, price, stockQuantity, and category are required",
      });
    }

    const newProduct = new Product({
      name,
      sku,
      description,
      detailedInfo,
      price,
      originalPrice,
      stockQuantity,
      images,
      category,
      brand,
      specifications,
      status,
      tags,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Successfully created a product",
      data: newProduct,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Product SKU already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error server",
      error: error.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, brand, status } = req.query;

    const query = {};
    if (search) query.name = { $regex: search, $options: "i" };
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (status) query.status = status;

    const products = await Product.find(query)
      .populate("category", "name")
      .populate("brand", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const count = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      page: Number(page),
      totalPages: Math.ceil(count / limit),
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET PRODUCT BY ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id)
      .populate("category", "name")
      .populate("brand", "name");

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated",
      data: updatedProduct,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "SKU already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
