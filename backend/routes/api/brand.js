const express = require('express');

const router = express.Router();
const { getAllBrands, getBrandsByCategory } =
        require("../../controllers/brandController");


router.get("/getAllBrands", getAllBrands);
router.get("/:categoryId", getBrandsByCategory)

module.exports = router;