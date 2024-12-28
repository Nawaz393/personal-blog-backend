const BlogPost = require("../models/blog");
const { convertImageBufferToBase64, constructBlogBlocks, extractImagesUrls } = require("../utils/helpers");
const { uploadImage, deleteImage } = require("../utils/uploadFile")
const postBlog = async (req, res) => {
    const { files } = req;
    let { title, text } = req.body
    text = Array.isArray(text) ? text : [text]
    const { _id, name } = req.user
    const tags = req.body.tags.length > 0 ? req.body.tags.toLowerCase().split(",") : []
    try {
        const imagePromises = files.map((file) => {
            const imageBase64 = convertImageBufferToBase64(file)
            return uploadImage(imageBase64);
        });
        const images = await Promise.all(imagePromises);
        const blogBlocks = constructBlogBlocks(title, text, images)
        const blogPost = new BlogPost({ title, blocks: blogBlocks, author: _id, authorName: name, tags })
        const result = await blogPost.save();
        if (!result) return res.status(500).json({ error: "Something went wrong" })
        return res.status(201).json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Something went wrong" })
    }
}

const getAllblogs = async (req, res) => {
    try {

        const page = req.query.page || 1
        const limit = req.query.limit || 10
        const tag = req.query.tag
        const type = req.query.type
        if (type === "popular") {
            const result = await BlogPost.find().sort({ "comments": -1 }).limit(5);
            return res.status(200).json({
                success: true,
                data: result
            })
        }
        const skip = (page - 1) * limit
        const query = tag ? { tags: { $in: [new RegExp(tag, 'i')] } } : {};
        const totalBlogs = await BlogPost.where(query).countDocuments()
        const totalPage = Math.ceil(totalBlogs / limit)
        const result = await BlogPost.find(query).skip(skip).limit(limit).sort({ createdAt: -1 })
        return res.status(200).json({
            success: true,
            pagination: {
                page,
                limit,
                totalPage,
                totalBlogs
            }
            , data: result
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Something went wrong" })
    }
}


const getBlogById = async (req, res) => {
    const { id } = req.params
    try {
        const result = await BlogPost.findById(id)
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Something went wrong" })
    }
}
const updateBlog = async (req, res) => {
    try {
        const { _id, data: updatedBlocks } = req.body;
        const blog = await BlogPost.findById(_id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        const updatedBlog = blog.blocks.map((block) => {
            const updatedBlock = updatedBlocks.find((b) => b._id.toString() === block._id.toString());

            if (updatedBlock && updatedBlock.type !== "image") {
                block.content = updatedBlock.content;
            }
            return block;
        });
        blog.blocks = updatedBlog;
        await blog.save();
        return res.status(200).json(blog);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const deleteBlog = async (req, res) => {
    const { id } = req.params
    try {
        const blog = await BlogPost.findById(id)
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" })
        }
        const imageUrls = extractImagesUrls(blog.blocks)
        const imagedeletionPromises = imageUrls.map((url) => deleteImage(url))

        const deletionResult = await Promise.all(imagedeletionPromises)
        console.log(deletionResult)

        const result = await BlogPost.findByIdAndDelete(id)
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Something went wrong" })
    }
}


const addComment = async (req, res) => {
    const { id, comment } = req.body
    const { _id, name } = req.user
    try {
        const blog = await BlogPost.findById(id)
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" })
        }
        const newComment = { author: _id, authorName: name, content: comment }
        blog.comments.push(newComment)
        await blog.save()
        return res.status(200).json(blog)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Something went wrong" })
    }
}












module.exports = {
    postBlog,
    getAllblogs,
    getBlogById,
    deleteBlog,
    updateBlog,
    addComment

}