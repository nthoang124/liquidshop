const Promotion = require("../../models/promotionModel");
const mongoose = require("mongoose");

//create promotion
const createPromotion = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      startDate,
      endDate,
      usageLimit,
    } = req.body;

    const existingPromotion = await Promotion.findOne({ code });
    if (existingPromotion) {
      return res
        .status(400)
        .json({ success: false, message: "Promotion code already exists" });
    }
    const promotion = new Promotion({
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      startDate,
      endDate,
      usageLimit,
    });
    await promotion.save();
    res.status(201).json({ success: true, data: promotion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all promotions
const getAllPromotions = async (req, res) => {
  try {
    const { isActive, page = 1, limit = 10 } = req.query;

    const query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const skip = (page - 1) * limit;

    const promotions = await Promotion.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Promotion.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: promotions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPromotionById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid promotion ID" });
    }
    const promotion = await Promotion.findById(id);
    if (!promotion) {
      return res
        .status(404)
        .json({ success: false, message: "Promotion not found" });
    }
    res.status(200).json({ success: true, data: promotion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedPromotion = await Promotion.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedPromotion) {
      return res
        .status(404)
        .json({ success: false, message: "Promotion not found" });
    }
    res.status(200).json({
      success: true,
      data: updatedPromotion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: "Promotion not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Promotion deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPromotion,
  getAllPromotions,
  getPromotionById,
  updatePromotion,
  deletePromotion
};
