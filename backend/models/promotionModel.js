const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const promotionSchema = new Schema({
  code: {
    type: String,
    unique: true,
    required: true
  },
  description: String,
  discountType: {
    type: String,
    enum: ['percentage', 'fixed_amount']
  },
  discountValue: {
    type: Number,
    required: true
  },
  minOrderAmount: {
    type: Number,
    default: 0
  },
  maxDiscountAmount: Number,
  startDate: Date,
  endDate: Date,
  usageLimit: Number,
  usedCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const Promotion = mongoose.model('Promotion', promotionSchema);

module.exports = Promotion;