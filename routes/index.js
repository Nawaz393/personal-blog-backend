const express = require('express')
const blogRouter = require('./blogs')
const userRouter = require('./user')
const apiRouter = express.Router()

apiRouter.use("/blogs", blogRouter)
apiRouter.use("/users", userRouter)

module.exports = apiRouter