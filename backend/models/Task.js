const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  inputText: {
    type: String,
    required: true
  },
  operationType: {
    type: String,
    required: true,
    enum: ['Uppercase', 'Lowercase', 'Reverse String', 'Word Count']
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Running', 'Success', 'Failed'],
    default: 'Pending'
  },
  result: {
    type: String,
    default: ''
  },
  logs: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
