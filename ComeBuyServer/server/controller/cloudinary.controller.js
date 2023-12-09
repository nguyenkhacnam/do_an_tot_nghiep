const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const SendResponse = require('../utils/SendResponse');
const { cloudinary } = require('../config/cloudinary.config')

exports.uploadImages = catchAsync(async (req, res, next) => {
    try {
        const listImages = req.body.data
        const result = []
        listImages.map(async (item) => {
            const uploadedResponse = await cloudinary.uploader.upload(item, {
                upload_preset: 'adminloader'
            });
            if (uploadedResponse)
                result.push(uploadedResponse.url)
            else next(new AppError("Upload Images Failed", 404))
            if (result.length == listImages.length) SendResponse(result,200,res)
        })
    }
    catch (error) {
        next(new AppError(error, 500))
    }
});

exports.uploadBigImages = catchAsync(async (req, res, next) => {
    try {
        const listImages = req.body.data
        const result = []
        listImages.map(async (item) => {
            const uploadedResponse = await cloudinary.uploader.upload(item, {
                upload_preset: 'adminloader',
                width: 1800, height: 600, crop: "pad" 
            });
            if (uploadedResponse)
                result.push(uploadedResponse.url)
            else next(new AppError("Upload Images Failed", 404))
            if (result.length == listImages.length) SendResponse(result,200,res)
        })
    }
    catch (error) {
        next(new AppError(error, 500))
    }
});
