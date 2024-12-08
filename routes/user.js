const express = require('express')
const userRouter = express.Router()

const { signUp, signIn, getAllUsers } = require('../controllers/user')
const authMiddleware = require('../middleware/auth')

userRouter.post("/signup", signUp)
userRouter.post("/signin", signIn)
userRouter.get("/", getAllUsers)
userRouter.get("/me", authMiddleware, (req, res) => res.status(200).json(req.user))





module.exports = userRouter

