const Review = require('../models/reviewModel')

const getReviewsProduct = async (req, res) => {
  const { id } = req.params

  try {
    const reviews = await Review.find({ productId: id, status: "approved" })
      .populate({
        path: "userId",
        select: "fullName email"
      })
      .sort({ createdAt: -1 })

    if (!reviews) {
      return res.status(404).json({
        message: 'Reviews not found'
      })
    }

    res.status(200).json({
      message: 'Get reviews product successful',
      data: reviews
    })
  }
  catch (error) {
    res.status(500).json({
      message: "Get reviews product error",
      error,
    })
  }
}

module.exports = { getReviewsProduct }