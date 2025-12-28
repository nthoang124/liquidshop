const express = require("express")

const router = express.Router();
const dashboardController = require("../../../controllers/admin/dashboardController");

router.get("/overview",dashboardController.overview);
module.exports = router;



