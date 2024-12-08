const express = require('express')
const blogRouter = express.Router()
const upload = require("../utils/storage")
const { postBlog, getAllblogs, getBlogById, deleteBlog, updateBlog, addComment } = require('../controllers/blogs')
const authMiddleware = require('../middleware/auth')

blogRouter.get("/", getAllblogs)
blogRouter.put("/", updateBlog)
blogRouter.get("/:id", getBlogById)
blogRouter.post("/", authMiddleware, upload.array("files"), postBlog)
blogRouter.delete("/:id", deleteBlog)
blogRouter.post("/comment", authMiddleware, addComment)

module.exports = blogRouter
