
const jwt = require("jsonwebtoken")
require("dotenv").config()

const convertImageBufferToBase64 = (imageBlob) => {
    let imageBase64 = imageBlob ? Buffer.from(imageBlob.buffer).toString("base64") : null;
    if (imageBase64 === null) {
        return null
    }
    imageBase64 = "data:" + imageBlob.mimetype + ";base64," + imageBase64;
    return imageBase64
}


const constructBlogBlocks = (title, text, images) => {
    const blocks = [];
    blocks.push({
        type: "title",
        content: title.trim()
    })

    for (let i = 0; i < Math.max(text.length, images.length); i++) {

        if (images[i]) {
            blocks.push({
                type: "image",
                content: images[i].secure_url
            })
        }
        if (text[i]) {
            blocks.push({
                type: "text",
                content: text[i].trim()
            })
        }

    }


    return blocks


}

const extractImagesUrls = (blocks) => {
    const imageUrls = [];
    blocks.forEach((block) => {
        if (block.type === "image") {
            imageUrls.push(block.content);
        }
    });
    return imageUrls;
};


const generateToken = (user) => {
    const payload = {
        _id: user._id,
        role: user.role

    }

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });
}
module.exports = { convertImageBufferToBase64, constructBlogBlocks, generateToken,extractImagesUrls }