const express = require('express')
const router = express.Router()

const { getReviewsProduct } = require('../../controllers/reviewController')

router.get('/:id', getReviewsProduct)

module.exports = router