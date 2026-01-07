const Feedback = require("../../models/feedbackModel");
const { sendEmail } = require('../../utils/sendMail')

const getAllFeedbacks = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const feedbacks = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Feedback.countDocuments(query);

    res.status(200).json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      feedbacks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    // Tự động chuyển trạng thái sang 'read' nếu đang là 'new'
    if (feedback.status === "new") {
      feedback.status = "read";
      await feedback.save();
    }

    res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const replyToFeedback = async (req, res) => {
  try {
    const { adminReply } = req.body;

    if (!adminReply || adminReply.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Admin reply cannot be empty",
      });
    }

    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    feedback.adminReply = adminReply;
    feedback.status = "replied";
    const saveFeedBack = await feedback.save();

    const message = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Phản hồi từ Liquid Shop</title>
</head>
<body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="650" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td align="center" style="padding:28px; background:#0f172a; border-radius:8px 8px 0 0;">
              <h1 style="margin:0; color:#ffffff;">Liquid Shop</h1>
              <p style="margin:6px 0 0; color:#cbd5e1; font-size:14px;">
                Phản hồi từ bộ phận hỗ trợ
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:32px;">
              <h2 style="color:#0f172a; margin-top:0;">
                Xin chào ${saveFeedBack.fullName || 'Quý khách'},
              </h2>

              <p style="color:#334155; font-size:15px;">
                Cảm ơn bạn đã liên hệ với <strong>Liquid Shop</strong>.
                Dưới đây là phản hồi của chúng tôi cho yêu cầu bạn đã gửi:
              </p>

              <!-- User Feedback -->
              <div style="background:#f8fafc; border-left:4px solid #2563eb; padding:16px; border-radius:4px; margin:20px 0;">
                <p style="margin:0 0 6px; font-size:14px; color:#0f172a;">
                  <strong>Tiêu đề:</strong> ${saveFeedBack.subject || 'Không có tiêu đề'}
                </p>
                <p style="margin:0; font-size:14px; color:#334155; line-height:1.6;">
                  ${saveFeedBack.message}
                </p>
                <p style="margin-top:10px; font-size:12px; color:#64748b;">
                  Gửi lúc: ${new Date(saveFeedBack.createdAt).toLocaleString('vi-VN')}
                </p>
              </div>

              <!-- Admin Reply -->
              <h3 style="color:#0f172a;">Phản hồi từ Liquid Shop</h3>
              <div style="background:#ecfeff; border-left:4px solid #06b6d4; padding:16px; border-radius:4px;">
                <p style="margin:0; font-size:14px; color:#0f172a; line-height:1.6;">
                  ${saveFeedBack.adminReply}
                </p>
              </div>

              <p style="margin-top:30px; color:#64748b; font-size:14px;">
                Nếu bạn còn bất kỳ thắc mắc nào, vui lòng phản hồi lại email này hoặc
                gửi yêu cầu mới trên website <strong>Liquid Shop</strong>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:20px; background:#f1f5f9; border-radius:0 0 8px 8px;">
              <p style="margin:0; color:#64748b; font-size:13px;">
                © ${new Date().getFullYear()} Liquid Shop. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    await sendEmail({
      to: saveFeedBack.email,
      subject: 'Reply feedback',
      html: message
    })

    res.status(200).json({
      success: true,
      message: "Replied to feedback successfully",
      data: saveFeedBack,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Feedback status is invalid'
      });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'feedback status updated successfully',
      data: feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllFeedbacks,
  getFeedbackById,
  replyToFeedback,
  updateFeedbackStatus,
  deleteFeedback
};
