const express = require('express')

const router = express.Router();
const { getAllCategories, getById } =
        require("../../controllers/categoryController")

router.get("/getAllCategories", getAllCategories);
router.get("/:id", getById);

module.exports = router;
