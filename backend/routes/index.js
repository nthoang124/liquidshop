const express = require('express')
const router = express.Router()
const authRoutes = require('./api/auth')
const userRoutes = require('./api/customer/user')
const categoryRoutes = require('./api/category')
const brandRoutes = require('./api/brand')
const categoryRoutesAdmin = require('./api/admin/category')
const productRoutes = require("./api/product")
const cartRoutes = require('./api/customer/cart')
const orderRoutes = require('./api/customer/order')
const paymentRoutes = require('./api/payment')
const promotionRoutes = require('./api/customer/promotion')
const { protectCustomer, protectAdmin } = require('../middlewares/user')
const brandRoutesAdmin = require('./api/admin/brand')
const productRoutesAdmin = require('./api/admin/product')
const adminRoutes = require('./api/admin/admin')
const orderRoutesAdmin = require('./api/admin/order')
const promotionRoutesAdmin = require('./api/admin/promotion')
const feedbackRoutesAdmin = require('./api/admin/feedback')
const reviewRoutesAdmin = require('./api/admin/review')
const paymentRoutesAdmin = require('./api/admin/payment')

router.use('/admin/product', protectAdmin, productRoutesAdmin);
router.use('/auth', authRoutes);
router.use('/users', protectCustomer, userRoutes)
router.use('/category', categoryRoutes)
router.use('/brand', brandRoutes)
router.use('/cart', protectCustomer, cartRoutes)
router.use('/order', protectCustomer, orderRoutes)
router.use('/payment', paymentRoutes)
router.use('/promotion', protectCustomer, promotionRoutes)

router.use('/admin/category', protectAdmin, categoryRoutesAdmin);
router.use('/admin/brand', protectAdmin, brandRoutesAdmin);
router.use('/products', productRoutes)
router.use('/admin/user', protectAdmin, adminRoutes);
router.use('/admin/order', protectAdmin, orderRoutesAdmin);
router.use('/admin/promotion', protectAdmin, promotionRoutesAdmin);
router.use('/admin/feedback', protectAdmin, feedbackRoutesAdmin);
router.use('/admin/review', protectAdmin, reviewRoutesAdmin);
router.use('/admin/payment', protectAdmin, paymentRoutesAdmin);



module.exports = router