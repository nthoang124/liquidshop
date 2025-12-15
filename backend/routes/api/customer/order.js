const express = require('express')
const router = express.Router()

const { createOrder, getOrderByCode, getOrdersUser } = require('../../../controllers/customer/orderController')

router.post('/', createOrder)
router.get('/:code', getOrderByCode)
router.get('/', getOrdersUser)

module.exports = router