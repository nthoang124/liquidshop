const express = require("express");

const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require("../../../controllers/admin/orderController");

router.get("/getAllOrders", getAllOrders);
router.get("/:id", getOrderById);
router.put("/update/:id", updateOrderStatus);

module.exports = router;
