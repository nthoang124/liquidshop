const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSessionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  messages: [{
    sender: {
      type: String,
      enum: ['user', 'bot']
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);

module.exports = ChatSession;