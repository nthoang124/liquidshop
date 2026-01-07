const express = require('express')
const router = express.Router()
const { changePassword, getMyProfile, updateMyProfile } = require("../../../controllers/customer/userController")

router.post("/change-password", changePassword)
router.get("/me", getMyProfile)
router.put("/me", updateMyProfile)

module.exports = router