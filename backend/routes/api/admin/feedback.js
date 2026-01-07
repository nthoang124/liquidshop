const express = require("express");
const router = express.Router();

const {
  getAllFeedbacks,
  getFeedbackById,
  replyToFeedback,
  updateFeedbackStatus,
  deleteFeedback,
} = require("../../../controllers/admin/feedbackController");

router.get("/getAllFeedbacks", getAllFeedbacks);
router.get("/:id", getFeedbackById);
router.post("/:id", replyToFeedback);
router.patch("/:id", updateFeedbackStatus);
router.delete("/:id", deleteFeedback);

module.exports = router;


