const express = require("express");
const router = express.Router();
const {
    getAllReviews,
    approveReview,
    rejectReview,
    replyToReview,
    deleteReviewByAdmin
} = require("../../../controllers/admin/reviewController");

router.get("/", getAllReviews);
router.put("/:id/approve", approveReview);
router.put("/:id/reject", rejectReview);
router.put("/:id/reply", replyToReview);
router.delete("/:id", deleteReviewByAdmin);

module.exports = router;