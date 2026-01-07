const express = require('express')
const router = express.Router()

const { createPayment } = require('../../../controllers/customer/paymentController')

router.post('/', createPayment)

module.exports = router