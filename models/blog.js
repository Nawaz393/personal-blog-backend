import mongoose from 'mongoose';

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
    comments: [CommentSchema]
}, {
    timestamps: true
});

const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

export default BlogPost;