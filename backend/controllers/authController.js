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

    const expiresIn = 60 * 60;

    const payload = {
      id: user.id,
      role: user.role
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn})

    const userResponse = {
      id: user._id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      createdAt: user.createdAt
    };

    res.json({
      message: "Login successful",
      token: token,
      expires_in: expiresIn,
      user: userResponse,
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
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8" />
        <title>Khôi phục mật khẩu - Liquid Shop</title>
      </head>
      <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding:40px 0;">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                
                <!-- Header -->
                <tr>
                  <td align="center" style="padding:30px; background:#0f172a; border-radius:8px 8px 0 0;">
                    <h1 style="margin:0; color:#ffffff; font-size:26px;">
                      Liquid Shop
                    </h1>
                    <p style="margin:8px 0 0; color:#cbd5e1; font-size:14px;">
                      Công nghệ chính hãng – Trải nghiệm đỉnh cao
                    </p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding:32px;">
                    <h2 style="margin-top:0; color:#0f172a;">
                      Yêu cầu khôi phục mật khẩu
                    </h2>

                    <p style="color:#334155; font-size:15px; line-height:1.6;">
                      Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại
                      <strong>Liquid Shop</strong>.
                    </p>

                    <p style="color:#334155; font-size:15px; line-height:1.6;">
                      Vui lòng nhấn vào nút bên dưới để tạo mật khẩu mới.
                      <br/>
                      <em>Liên kết này chỉ có hiệu lực trong <strong>10 phút</strong>.</em>
                    </p>

                    <!-- Button -->
                    <div style="text-align:center; margin:32px 0;">
                      <a href="${resetURL}" 
                        clicktracking="off"
                        style="
                          background:#2563eb;
                          color:#ffffff;
                          padding:14px 28px;
                          text-decoration:none;
                          font-size:16px;
                          font-weight:bold;
                          border-radius:6px;
                          display:inline-block;
                        ">
                        Đặt lại mật khẩu
                      </a>
                    </div>

                    <p style="color:#64748b; font-size:14px; line-height:1.6;">
                      Nếu bạn không yêu cầu khôi phục mật khẩu, vui lòng bỏ qua email này.
                      Tài khoản của bạn sẽ vẫn an toàn.
                    </p>

                    <hr style="border:none; border-top:1px solid #e2e8f0; margin:30px 0;" />

                    <p style="color:#94a3b8; font-size:13px;">
                      Nếu nút không hoạt động, bạn có thể sao chép và dán liên kết sau vào trình duyệt:
                      <br/>
                      <a href="${resetURL}" clicktracking="off" style="color:#2563eb; word-break:break-all;">
                        ${resetURL}
                      </a>
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