const express = require('express')
const router = express.Router()
const authRoutes = require('./api/auth')
const userRoutes = require('./api/customer/user')
const categoryController = require('./api/admin/category')
const { protectCustomer, protectAdmin } = require('../middlewares/user')
const brandRoutes = require('./api/admin/brand')
const productRoutes = require('./api/admin/product')

router.use('/admin/product', protectAdmin, productRoutes)
router.use('/auth', authRoutes)
router.use('/users', protectCustomer, userRoutes)
router.use('/admin/category',protectAdmin,categoryController);
router.use('/admin/brand',protectAdmin,brandRoutes);

module.exports = router