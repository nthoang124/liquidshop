const express = require('express')
const router = express.Router()

const { createReview } = require('../../../controllers/customer/reviewController')

router.post('/', createReview)

module.exports = router