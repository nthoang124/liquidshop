const express = require('express')
const router = express.Router()

const { chatWithAI, getHistory, resetSession } = require('../../../controllers/customer/chatbotController')

router.post('/', chatWithAI)
router.get('/', getHistory)
router.delete('/', resetSession)

module.exports = router