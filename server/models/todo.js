const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  dueDate: {
    type: String,
    required: true
  },
  userId: {type: mongoose.Schema.ObjectId, ref: 'User'}
})

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;