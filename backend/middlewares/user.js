const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const protectCustomer = async (req, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(' ')[1]
      req.user = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(req.user.id)

      if (!user) {
        return res.status(404).json({
          message: "User not found"
        })
      }
      if (!user.isActive) {
        return res.status(401).json({
          message: "User has been banned"
        })
      }

      req.user = user
      next()
    }
    catch (error) {
      res.status(401).json({
        message: "Invalid token",
        error: error
      })
    }

  }
  if (!token) {
    res.status(404).json({
      message: "Token not found"
    })
  }
}

const protectAdmin = async (req, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(' ')[1]
      req.user = jwt.verify(token, process.env.JWT_SECRET)
      if (req.user.role != 'admin') {
        return res.status(403).json({
          message: "User has no premissons"
        })
      }
      next()
    }
    catch (error) {
      res.status(401).json({
        message: "Invalid token",
        error: error
      })
    }

  }
  if (!token) {
    res.status(404).json({
      message: "Token not found"
    })
  }
}

module.exports = { protectCustomer, protectAdmin }