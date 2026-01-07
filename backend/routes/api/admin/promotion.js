const express = require('express');

const router = express.Router();
const { createPromotion, getAllPromotions, getPromotionById, updatePromotion, deletePromotion } = 
        require("../../../controllers/admin/promotionController");
    
router.post("/createPromotion", createPromotion);
router.get("/getAllPromotions", getAllPromotions);
router.get("/:id", getPromotionById);
router.put("/:id", updatePromotion);
router.delete("/:id", deletePromotion);

module.exports = router;