const express = require('express')
const router = express.Router()

const { addWithList, removeWithList, getWishList } = require('../../../controllers/customer/wishlistController')

router.post('/:id', addWithList)
router.delete('/:id', removeWithList)
router.get('/', getWishList)


module.exports = router