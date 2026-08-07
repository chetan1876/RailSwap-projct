const cloudinary = require("../../config/cloudinary");

const uploadFile = async (filePath, folder = "RailSwap") => {

    try {

        const result = await cloudinary.uploader.upload(filePath, {

            folder,

        });

        return result;

    } catch (error) {

        throw error;

    }

};

module.exports = {
    uploadFile,
};