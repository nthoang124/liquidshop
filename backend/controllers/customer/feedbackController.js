const Feedback = require('../../models/feedbackModel')

const createFeedBack = async (req, res) => {
  const user = req.user
  const { subject, message } = req.body

  try {
    const newFeedBack = new Feedback({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      subject,
      message
    })
    const saveFeedBack = await newFeedBack.save()

    res.status(201).json({
      message: "Create feedback successful",
      feedback: saveFeedBack
    })
  }
  catch (error) {
    res.status(500).json({
      message: 'Create feedback error',
      error
    })
  }

}

module.exports = { createFeedBack }