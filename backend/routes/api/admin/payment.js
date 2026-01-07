const express = require("express");
const router = express.Router();

const {
  getAllPayments,
  getPaymentById,
  updatePaymentStatus,
  deletePayment
} = require("../../../controllers/admin/paymentController");

router.get("/", getAllPayments);
router.get("/:id", getPaymentById);
router.put("/:id", updatePaymentStatus);
router.delete("/:id", deletePayment);

module.exports = router;