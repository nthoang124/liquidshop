const Review = require("../../models/reviewModel");
const { updateProductRating } = require("../../utils/updateProductRating");

const getAllReviews = async (req, res) => {
  try {
    const { status, rating, page = 1, limit = 10, search } = req.query;
    const query = {};
    if (status) {
      query.status = status;
    }

    if (rating) {
      query.rating = Number(rating);
    }

    const skip = (page - 1) * limit;

    let reviews = await Review.find(query)
      .populate("userId", "fullName email")
      .populate("productId", "name images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    if (search) {
      reviews = reviews.filter((review) => {
        const userName = review.userId?.fullName?.toLowerCase() || "";
        const productName = review.productId?.name?.toLowerCase() || "";
        return (
          userName.includes(search.toLowerCase()) ||
          productName.includes(search.toLowerCase())
        );
      });
    }

    const total = await Review.countDocuments(query);

    res.status(200).json({
      success: true,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const  approveReview = async (req, res) => {
    try {
      const { id } = req.params;
      
      const review = await Review.findByIdAndUpdate(
        id,
        { status: 'approved' },
        { new: true }
      ).populate('userId', 'fullName email')
       .populate('productId', 'name');
      
      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'review not found'
        });
      }
      
      await updateProductRating(review.productId?._id || review.productId);
      
      res.status(200).json({
        success: true,
        message: 'Review approved successfully',
        data: review
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  // Từ chối review (Admin)
 const rejectReview = async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      
      const review = await Review.findByIdAndUpdate(
        id,
        { 
          status: 'rejected',
          adminReply: reason || 'This review does not meet our guidelines'
        },
        { new: true }
      ).populate('userId', 'fullName email')
       .populate('productId', 'name');
      
      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Review rejected successfully',
        data: review
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

const replyToReview = async (req, res) => {
    try {
      const { id } = req.params;
      const { adminReply } = req.body;
      
      if (!adminReply || adminReply.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Reply content cannot be empty'
        });
      }
      
      const review = await Review.findByIdAndUpdate(
        id,
        { adminReply },
        { new: true }
      ).populate('userId', 'fullName email')
       .populate('productId', 'name');
      
      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Reply added successfully',
        data: review
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

const deleteReviewByAdmin = async (req, res) => {
    try {
      const { id } = req.params;
      
      const review = await Review.findByIdAndDelete(id);
      
      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'review not found'
        });
      }
      
      await updateProductRating(review.productId);
      
      res.status(200).json({
        success: true,
        message: 'Review deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

module.exports = {
  getAllReviews,
  approveReview,
  rejectReview,
  replyToReview,
  deleteReviewByAdmin
};
