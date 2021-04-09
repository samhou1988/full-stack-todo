const mongoose = require('mongoose');

// Declare Schema
const TodoSchema = new mongoose.Schema(
  {
    description: { type: String },
    done: { type: Boolean },
  },
  { timestamps: true },
);

// Export Model to be used in Node
module.exports = mongoose.model('Todo', TodoSchema);
