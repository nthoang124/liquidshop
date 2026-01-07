const express = require('express')
const router = express.Router()
const { registerCustomer, registerAdmin, loginCustomer, loginAdmin, createResetToken, resetPassword } = require("../../controllers/authController")

router.post("/register/customer", registerCustomer)
router.post("/login/customer", loginCustomer)

router.post("/register/admin", registerAdmin)
router.post("/login/admin", loginAdmin)

router.post("/reset-password", createResetToken)
router.post("/reset-password/:token", resetPassword)
module.exports = router