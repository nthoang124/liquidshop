const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  orderCode: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerInfo: {
    fullName: String,
    email: String,
    phoneNumber: String,
    shippingAddress: {
      street: String,
      ward: String,
      district: String,
      city: String
    }
  },
  items: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    name: String,
    sku: String,
    quantity: Number,
    price: Number
  }],
  subtotal: {
    type: Number,
    default: 0
  },
  shippingFee: {
    type: Number,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  voucherCode: String,
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'BankTransfer', 'OnlineGateway']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending_confirmation', 'processing', 'shipping', 'completed', 'cancelled'],
    default: 'pending_confirmation'
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);

