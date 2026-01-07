const express = require('express')
const router = express.Router()

const { createOrder, getOrderByCode, getOrdersUser, cancelOrder } = require('../../../controllers/customer/orderController')

router.post('/', createOrder)
router.get('/:code', getOrderByCode)
router.get('/', getOrdersUser)
router.post('/:orderCode', cancelOrder)

module.exports = router