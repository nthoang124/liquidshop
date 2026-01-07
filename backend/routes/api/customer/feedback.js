const express = require('express')
const router = express.Router()

const { createFeedBack } = require('../../../controllers/customer/feedbackController')

router.post('/', createFeedBack)

module.exports = router