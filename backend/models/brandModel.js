const mongoose = require("mongoose")

const brandSchema = mongoose.Schema({
  name: { type: String, unique: true, required: true },
  description: { type: String },
  imageUrl: { type: String },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }
}, { timestamps: false })

const Brand = mongoose.model("Brand", brandSchema)

module.exports = Brand