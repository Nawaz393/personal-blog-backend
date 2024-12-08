const mongoose = require('mongoose');
const BlockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['title', 'text', 'image'],
    required: true
  },
  content: {
    type: String,
    default: ''
  },
  file: {
    private_id: String,
    url: String
  }
});
const CommentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
}, {
  timestamps: true
});

const BlogPostSchema = new mongoose.Schema({
  blocks: [BlockSchema],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  comments: [CommentSchema],
  tags: [String],
}, {
  timestamps: true
});

const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

module.exports = BlogPost;