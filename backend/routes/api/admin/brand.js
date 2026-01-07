const express = require('express');

const router = express.Router();
const { createBrand, getAllBrands, updateBrand, deleteBrand } = 
        require("../../../controllers/admin/brandController");

router.post("/createBrand", createBrand);
router.get("/getAllBrands", getAllBrands);
router.put("/:id", updateBrand);
router.delete("/:id", deleteBrand); 

module.exports = router;