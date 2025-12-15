const Review = require('../../models/reviewModel')

const createReview = async (req, res) => {
  const userId = req.user.id
  const { productId, comment, rating } = req.body

  try {
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