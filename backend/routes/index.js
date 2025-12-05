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

router.use('/admin/product', protectAdmin, productRoutesAdmin);
router.use('/auth', authRoutes);
router.use('/users', protectCustomer, userRoutes)

router.use('/admin/category',protectAdmin,categoryRoutesAdmin);
router.use('/admin/brand',protectAdmin,brandRoutesAdmin);
router.use('/products', productRoutes)
router.use('/admin/user', protectAdmin, adminRoutes);

module.exports = router