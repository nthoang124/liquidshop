const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  phoneNumber: { type: String },
  avatarUrl: { type: String },
  addresses: [
    {
      street: String,
      ward: String,
      district: String,
      city: String,
      isDefault: { type: Boolean, default: false }
    }
  ],
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  isActive: { type: Boolean, default: true },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date }
}, { timestamps: true });

const User = mongoose.model("User", userSchema)

module.exports = User