const Feedback = require("../../models/FeedbackModel");

const getAllFeedbacks = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const feedbacks = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Feedback.countDocuments(query);

    res.status(200).json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total/ limit),
      feedbacks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    // Tự động chuyển trạng thái sang 'read' nếu đang là 'new'
    if (feedback.status === "new") {
      feedback.status = "read";
      await feedback.save();
    }

    res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const replyToFeedback = async (req, res) => {
  try {
    const { adminReply } = req.body;

    if (!adminReply || adminReply.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Admin reply cannot be empty",
      });
    }

    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    feedback.adminReply = adminReply;
    feedback.status = "replied";
    await feedback.save();
    
    res.status(200).json({
      success: true,
      message: "Replied to feedback successfully",
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateFeedbackStatus = async (req, res) => {
    try {
      const { status } = req.body;
      
      if (!['new', 'read', 'replied'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Feedback status is invalid'
        });
      }
      
      const feedback = await Feedback.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
      
      if (!feedback) {
        return res.status(404).json({
          success: false,
          message: 'Feedback not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'feedback status updated successfully',
        data: feedback
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
};

const deleteFeedback = async (req, res) => {
    try {
      const feedback = await Feedback.findByIdAndDelete(req.params.id);
      
      if (!feedback) {
        return res.status(404).json({
          success: false,
          message: 'Feedback not found',
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Feedback deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
};

module.exports = {
    getAllFeedbacks,
    getFeedbackById,
    replyToFeedback,
    updateFeedbackStatus,
    deleteFeedback
};
