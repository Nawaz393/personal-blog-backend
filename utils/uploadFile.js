const cloudinary = require("cloudinary").v2
require('dotenv').config()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(imageBase64) {
    try {
        const result = await cloudinary.uploader.upload(imageBase64, {
            folder: 'blogs_images',
            public_id: `image-${generateUniqueString()}`,
            overwrite: true,
            resource_type: "auto"
        });

        return { secure_url: result.secure_url, private_id: result.public_id };
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
}


const deleteImage = async (ImageUrl) => {

    try {
        const result = await cloudinary.uploader.destroy(getPublicIdFromUrl(ImageUrl), { resource_type: "image" });
        console.log(result)
        return result.result === "ok" ? true : false;
    } catch (error) {
        throw error
    }
}






const getPublicIdFromUrl = (imageUrl) => {
    const name = imageUrl.split("/").pop().split(".")[0]
    return `data_dir/${name}`
}

function generateUniqueString() {
    const timestamp = new Date().getTime();
    const randomPart = Math.random().toString(36).substring(2, 8); // Use a random string
    return `${timestamp}-${randomPart}`;
}

module.exports = { uploadImage, deleteImage }