
const mongoose = require('mongoose')

const brandSchema = mongoose.Schema({
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    logoUrl: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Brand = mongoose.model('Brand', brandSchema)

module.exports = Brand;
