const express = require('express');

const router = express.Router();
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = 
        require("../../../controllers/admin/productController");

router.post("/createProduct", createProduct);
router.get("/getAllProducts", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;