const express = require('express')

const router = express.Router();
const {createCategory, getAllCategories,getById,updateCategory,deleteCategory} = 
        require("../../../controllers/admin/categoryController")

router.post("/createCategory",createCategory);
router.get("/getAllCategories",getAllCategories);
router.get("/:id",getById);
router.put("/:id",updateCategory);
router.delete("/:id",deleteCategory);

module.exports = router;
