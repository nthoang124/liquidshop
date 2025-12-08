const express = require('express')

const router = express.Router();
const { getAllOrders,getOrderById } = 
        require("../../../controllers/admin/orderController")
        
router.get("/getAllOrders", getAllOrders);
router.get("/:id", getOrderById);

module.exports = router;