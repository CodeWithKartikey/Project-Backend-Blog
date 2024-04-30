// Importing required modules

// Import file system dependencies from fs
import fs from 'fs';
// Import cloudinary modules from cloudinary
import { v2 as cloudinary } from 'cloudinary';
// Utility functions for handling errors & responses.
import ApiError from './apiError.util.js';
import ApiResponse from './apiResponse.util.js';

// Configure Cloudinary with API credentials
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Function to upload a file to Cloudinary
const uploadOnCloudinary = async (localFilePath, res) => {
    try {
        // Check if localFilePath is provided
        if(!localFilePath) {
            throw new ApiError(404, 'File not found, cannot upload.');
        }  
        // Upload file to Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(localFilePath, { resource_type: 'auto' });
        // Delete local file after successful upload
        fs.unlink(localFilePath, (error) => {
            if(error) {
                console.error('Error deleting local file after upload to Cloudinary.', error);
            }
        });
        return cloudinaryResponse;
    } catch (error) {
        // Delete local file if upload to Cloudinary fails
        if (fs.existsSync(localFilePath)) {
            fs.unlink(localFilePath, (error) => {
                if(error) {
                    console.error('Error deleting local file after failed upload to Cloudinary.', error);
                }
            });
        }
        // Return error response
        return res
            .status(error.status || 500)
            .json(new ApiResponse(error.status || 500, {}, error.message));
    }
};

// Function to remove a file from Cloudinary
const removeFromCloudinary = async (existingFilePath, res) => {
    try {
        // Check if existingFilePath is provided
        if(!existingFilePath) {
            throw new ApiError(404, 'No existing file path is available.');
        }
        // Remove file from Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.destroy(existingFilePath);
        return cloudinaryResponse;
    } catch (error) {
        // Return error response
        return res
            .status(error.status || 500)
            .json(new ApiResponse(error.status || 500, {}, error.message));
    }
};

// Export the uploadOnCloudinary & removeFromCloudinary functions
export { uploadOnCloudinary, removeFromCloudinary };
