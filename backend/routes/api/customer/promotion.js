const express = require('express')
const router = express.Router()

const { getPromotionByCode } = require('../../../controllers/customer/promotionController')

router.get('/:code', getPromotionByCode)

module.exports = router