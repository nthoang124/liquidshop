const express = require('express')
const router = express.Router()
const authRoutes = require('./api/auth')
const userRoutes = require('./api/customer/user')
const categoryRoutesAdmin = require('./api/admin/category')
const productRoutes = require("./api/product")
const { protectCustomer, protectAdmin } = require('../middlewares/user')
const brandRoutesAdmin = require('./api/admin/brand')
const productRoutesAdmin = require('./api/admin/product')
const adminRoutes = require('./api/admin/admin')
const orderRoutesAdmin = require('./api/admin/order')
const promotionRoutesAdmin = require('./api/admin/promotion')
const feedbackRoutesAdmin = require('./api/admin/feedback')
const reviewRoutesAdmin = require('./api/admin/review')
const paymentRoutesAdmin = require('./api/admin/payment')
const dashboard = require('./api/admin/dashboard')

router.use('/admin/product', protectAdmin, productRoutesAdmin);
router.use('/auth', authRoutes);
router.use('/users', protectCustomer, userRoutes)

router.use('/admin/category',protectAdmin,categoryRoutesAdmin);
router.use('/admin/brand',protectAdmin,brandRoutesAdmin);
router.use('/products', productRoutes)
router.use('/admin/user', protectAdmin, adminRoutes);
router.use('/admin/order', protectAdmin, orderRoutesAdmin);
router.use('/admin/promotion', protectAdmin, promotionRoutesAdmin);
router.use('/admin/feedback', protectAdmin, feedbackRoutesAdmin);
router.use('/admin/review', protectAdmin, reviewRoutesAdmin);
router.use('/admin/payment', protectAdmin, paymentRoutesAdmin);
router.use('/admin/dashboard',protectAdmin,dashboard);



module.exports = router