const mongoose = require('mongoose')

const categorySchema = mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    description: { type: String },
    imageUrl: { type: String },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null
    }
  },
  {
    timestamps: true
  }
)

const Category = mongoose.model('Category', categorySchema)

module.exports = Category