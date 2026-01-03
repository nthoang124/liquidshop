const Order = require("../../models/orderModel");
const mongoose = require("mongoose");

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      orderStatus,
      paymentStatus,
      paymentMethod,
      userId,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const filter = {};

    if (orderStatus) filter.orderStatus = orderStatus;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    if (userId && mongoose.Types.ObjectId.isValid(userId))
      filter.userId = userId;

    if (search) {
      filter.$or = [
        { orderCode: { $regex: search, $options: "i" } },
        { "customerInfo.fullName": { $regex: search, $options: "i" } },
        { "customerInfo.phoneNumber": { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("userId", "fullName email")
      .populate("items.productId", "name sku");

    const count = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      count,
      Page: Number(page),
      totalPages: Math.ceil(count / limit),
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }
    const order = await Order.findById(id)
      .populate("userId", "fullName email")
      .populate("items.productId", "name sku");
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
