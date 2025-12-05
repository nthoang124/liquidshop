const express = require('express');

const router = express.Router();
const { getAllUsers, getUserById, updateRole } = 
        require("../../../controllers/admin/adminController");  

router.get("/getAllUsers", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateRole);

module.exports = router;