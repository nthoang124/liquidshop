const express = require('express');
const router = express.Router();
const { momo_return, vnpay_return } = require('../../controllers/paymentController')

router.get('/vnpay_return', vnpay_return)

router.get('/momo_return', momo_return)


module.exports = router;