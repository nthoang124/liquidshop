const bcryptjs = require('bcryptjs')

const User = require('../../models/userModel')

const changePassword = async (req, res) => {
  try {
    const { password, new_password } = req.body

    const isMatch = await bcryptjs.compare(password, req.user.password)
    if (!isMatch) {
      return res.status(401).json({
        message: "Password not correct!"
      })
    }

    const salt = bcryptjs.genSaltSync(10)
    const hashNewPassword = await bcryptjs.hash(new_password, salt)
    req.user.password = hashNewPassword
    const saveUser = await req.user.save()

    res.status(200).json({
      message: "Change password successful!",
      user: saveUser
    })
  }
  catch (error) {
    res.status(500).json({
      message: "Can not change password!",
      error: error
    })
  }
}

const getMyProfile = async (req, res) => {
  try {
    res.status(200).json(req.user)
  }
  catch (error) {
    res.status(500).json({
      message: "Can not get profile",
      error: error
    })
  }
}

const updateMyProfile = async (req, res) => {
  try {
    const userData = req.body
    userData.updatedAt = Date.now()
    await req.user.updateOne(userData)
    const saveUser = await req.user.save()

    res.status(200).json({
      message: "Update profile susseccful!",
      user: saveUser
    })
  }
  catch (error) {
    res.status(500).json({
      message: "Can not update profile",
      error: error
    })
  }
}


module.exports = { changePassword, getMyProfile, updateMyProfile }