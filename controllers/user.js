const User = require("../models/user")
const bcrypt = require("bcryptjs")
const { generateToken } = require("../utils/helpers")

const signUp = async (req, res) => {

    const { email, name, password } = req.body
    try {

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({ email, name, password: hashedPassword })
        const token = generateToken(user)
        res.status(201).json({ token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Something went wrong" })
    }
}

const signIn = async (req, res) => {

    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User does not exist" })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        const token = generateToken(user)
        res.status(200).json({ token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password")
        res.status(200).json(users)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
}
module.exports = { signUp, signIn, getAllUsers }