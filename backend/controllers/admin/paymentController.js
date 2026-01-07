const Payment = require("../../models/paymentModel");

const getAllPayments = async (req, res) => {
  try {
    const { status, method, page = 1, limit = 10, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (method) query.method = method;

    if (search) {
      query.$or = [
        { transactionCode: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (page - 1) * limit;

    const payments = await Payment.find(query)
      .populate("userId", "fullName email")
      .populate("orderId", "orderCode totalAmount")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Payment.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: payments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id)
      .populate("userId", "fullName email")
      .populate("orderId", "orderCode totalAmount");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "success", "failed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const payment = await Payment.findByIdAndUpdate(
      id,
      { 
        status,
        updatedAt: Date.now(),
      },
      { new: true }
    )
    .populate("userId", "fullName email")
    .populate("orderId", "orderCode totalAmount");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      data: payment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByIdAndDelete(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = {
  getAllPayments,
  getPaymentById,
  updatePaymentStatus,
  deletePayment,
};