const express = require('express')
const router = express.Router()

const { createOrder, getOrderByCode } = require('../../../controllers/customer/orderController')

router.post('/', createOrder)
router.get('/:code', getOrderByCode)

module.exports = router