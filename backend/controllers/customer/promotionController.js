const Promotion = require('../../models/promotionModel')

const getPromotionByCode = async (req, res) => {
  const { code } = req.params

  try {
    const promotion = await Promotion.findOne({ code, isActive: true })

    if (!promotion) {
      return res.status(400).json({
        message: "Invalid discount code"
      });
    }

    const now = new Date();
    if (now < promotion.startDate || now > promotion.endDate) {
      return res.status(400).json({
        message: "Discount code expired"
      });
    }

    if (promotion.usageLimit && promotion.usedCount >= promotion.usageLimit) {
      return res.status(400).json({
        message: "Discount code has reached its usage limit"
      });
    }

    res.status(201).json({
      message: "Get promotion by code successful",
      promotion
    })
  }
  catch (error) {
    res.status(500).json({
      message: "Get promotion by code error",
      error: error
    })
  }
}

module.exports = { getPromotionByCode }