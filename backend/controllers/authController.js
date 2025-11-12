const User = require("../models/userModel")
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const { sendEmail } = require('../utils/sendMail')

const registerCustomer = async (req, res) => {
  try {
    const userData = req.body
    const email = userData.email
    const password = userData.password

    const salt = await bcryptjs.genSaltSync(10);
    const hashPassword = await bcryptjs.hash(password, salt)
    userData.password = hashPassword

    const newUser = new User(userData)
    const saveUser = await newUser.save()

    res.status(201).json({
      message: "Register successful~",
      user: saveUser
    })

  }
  catch (error) {
    res.status(500).json({
      message: "Register error",
      error: error
    })
  }
}

const registerAdmin = async (req, res) => {
  try {
    const userData = req.body
    const password = userData.password

    const salt = await bcryptjs.genSaltSync(10);
    const hashPassword = await bcryptjs.hash(password, salt)
    userData.password = hashPassword
    userData.role = "admin"
    const newUser = new User(userData)
    const saveUser = await newUser.save()

    res.status(201).json({
      message: "Register successful~",
      user: saveUser
    })

  }
  catch (error) {
    res.status(500).json({
      message: "Register error",
      error: error
    })
  }
}

const loginCustomer = async (req, res) => {
  try {
    const userData = req.body
    const email = userData.email
    const password = userData.password

    const user = await User.findOne({ email: email })

    if (!user) {
      return res.status(404).json({
        message: "Email or password is not correct!"
      })
    }

    const isMatch = await bcryptjs.compare(password, user.password)
    if (!isMatch || user.role != 'customer') {
      return res.status(401).json({
        message: "Email or password is not correct!"
      })
    }

    const payload = {
      id: user.id,
      role: user.role
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" })

    res.json({
      message: "Login successful",
      token: token
    })

  }
  catch (error) {
    res.status(500).json({
      message: "Login error",
      error: error
    })
  }
}

const loginAdmin = async (req, res) => {
  try {
    const userData = req.body
    const email = userData.email
    const password = userData.password

    const user = await User.findOne({ email: email })

    if (!user) {
      return res.status(404).json({
        message: "Email or password is not correct!"
      })
    }

    const isMatch = await bcryptjs.compare(password, user.password)
    if (!isMatch || user.role != 'admin') {
      return res.status(401).json({
        message: "Email or password is not correct!"
      })
    }

    const payload = {
      id: user.id,
      role: user.role
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" })

    res.json({
      message: "Login successful",
      token: token
    })

  }
  catch (error) {
    res.status(500).json({
      message: "Login error",
      error: error
    })
  }
}

const createResetToken = async (req, res) => {
  try {
    const email = req.body.email

    const user = await User.findOne({ email: email })
    if (!user) {
      return res.status(404).json({ message: "User not found!" })
    }
    const resetToken = crypto.randomBytes(32).toString('hex');

    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    user.passwordResetExpires = Date.now() + 1000 * 60 * 10
    await user.save()

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const message = `
      <h1>Bạn đã yêu cầu khôi phục mật khẩu</h1>
      <p>Vui lòng nhấp vào đường link này để đặt lại mật khẩu (link có hiệu lực 10 phút):</p>
      <a href="${resetURL}" clicktracking=off>${resetURL}</a>
    `

    await sendEmail({
      to: user.email,
      subject: 'Reset Password',
      html: message
    })

    res.status(200).json({
      message: "Recovery email has been sent!"
    })
  }
  catch (error) {
    res.status(500).json({
      message: "Can not create reset token",
      error: error
    })
  }
}

const resetPassword = async (req, res) => {
  try {
    const token = req.params.token
    const newPassword = req.body.password

    const hashToken = crypto.createHash('sha256').update(token).digest('hex')

    const user = await User.findOne({
      passwordResetToken: hashToken,
      passwordResetExpires: { $gt: Date.now() }
    })
    if (!user) {
      return res.status(404).json({
        message: "User not found!"
      })
    }
    const salt = bcryptjs.genSaltSync(10)
    const hashNewPassword = await bcryptjs.hash(newPassword, salt)
    user.password = hashNewPassword
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined

    const saveUser = await user.save()

    res.status(200).json({
      message: "Reset password successful!",
      user: saveUser
    })
  }
  catch (error) {
    res.status(500).json({
      message: "Can not reset password",
      error: error
    })
  }
}


module.exports = { registerCustomer, registerAdmin, loginCustomer, loginAdmin, createResetToken, resetPassword }