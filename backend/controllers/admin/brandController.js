const Brand = require("../../models/brandModel");

const createBrand = async (req, res) => {
  try {
    const { name, logoUrl, description } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Brand name is required",
      });
    }
    const newBrand = new Brand({
      name,
      logoUrl,
      description,
    });
    await newBrand.save();
    res.status(201).json({
      success: true,
      message: "Successfully created a brand",
      data: newBrand,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Brand name already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error server",
      error: error.message,
    });
  }
};

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

const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, logoUrl, description } = req.body;
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }
    brand.name = name || brand.name;
    brand.logoUrl = logoUrl || brand.logoUrl;
    brand.description = description || brand.description;

    await brand.save();

    res.status(200).json({
      success: true,
      message: "Successfully updated brand",
      data: brand,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Brand name already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error server",
      error: error.message,
    });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findByIdAndDelete(id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Successfully deleted brand",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error server",
      error: error.message,
    });
  }
};
module.exports = {
  createBrand,
  getAllBrands,
  updateBrand,
  deleteBrand,
};
