const express = require('express')
const router = express.Router()

const { chatWithAI, getHistory } = require('../../../controllers/customer/chatbotController')

router.post('/', chatWithAI)
router.get('/', getHistory)

module.exports = router