const Review = require('../../models/reviewModel')
const Order = require('../../models/orderModel')

const createReview = async (req, res) => {
  const userId = req.user.id
  const { productId, comment, rating } = req.body

  try {
    const hasPurchased = await Order.findOne({
      userId: userId,
      orderStatus: 'completed',
      "items.productId": productId
    });

    if (!hasPurchased) {
      return res.status(403).json({
        success: false,
        message: "You need to successfully purchase and receive this product before you can review it!"
      });
    }

    const alreadyReviewed = await Review.findOne({
      userId: userId,
      productId: productId
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product."
      });
    }

    const newReview = new Review({
      productId,
      userId,
      rating,
      comment,
    })
    const saveReview = await newReview.save()

    res.status(201).json({
      message: 'Create review successful',
      review: saveReview
    })

  }
  catch (error) {
    res.status(500).json({
      message: "Create review error",
      error
    })
  }
}

module.exports = { createReview }