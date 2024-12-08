const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();
const authMiddleware = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer")) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authorization.split(" ")[1];
    if (token == 'undefined' || !token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const payload = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload._id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({ message: "Unauthorized" });
    }
};

module.exports = authMiddleware;
