const bcryptjs = require('bcryptjs')

const User = require('../models/userModel')

const changePassword = async (req, res) => {
  try {
    const idUser = req.user.id
    const { password, new_password } = req.body

    const user = await User.findById(idUser)

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    const isMatch = bcryptjs.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({
        message: "Password not correct!"
      })
    }

    const salt = bcryptjs.genSaltSync(10)
    const hashNewPassword = await bcryptjs.hash(new_password, salt)
    user.password = hashNewPassword
    const saveUser = await user.save()

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




module.exports = { changePassword }