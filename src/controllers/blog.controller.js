// Importing required modules

// Importing the Task model for this controller
import Blog from '../models/blog.model.js';
// Utility functions for handling errors, responses, and asynchronous operations
import ApiError from '../utils/apiError.util.js';
import ApiResponse from '../utils/apiResponse.util.js';
import asyncHandler from '../utils/asyncHandler.util.js';
// Utility functions for uploading the data to the cloudinary server
import { uploadOnCloudinary, removeFromCloudinary } from '../utils/cloudinary.util.js';

/*
    Controller function to get all the blogs for all the users.
    Handles the HTTP GET request to get all the blogs.

    @param {Object} req - The HTTP request object.
    @param {Object} res - The HTTP response object.
    @returns {Object} HTTP response with JSON data.
*/
const getAllBlogs = asyncHandler(async (req, res) => {

    const getAllBlogs = await Blog.find();

    if(getAllBlogs.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, getAllBlogs, 'No blogs found.'));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, getAllBlogs, 'All blogs found successfully.'));
});

/*
    Controller function to get all the tasks to its respective owner
    Handles the HTTP GET request to get all the blogs.

    @param {Object} req - The HTTP request object.
    @param {Object} res - The HTTP response object.
    @returns {Object} HTTP response with JSON data.
*/
const getBlogs = asyncHandler(async (req, res) => {

    const { id } = req.user;
    
    const getBlogs = await Blog.find({ user: id});

    if(getBlogs.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, getBlogs, 'No blogs found for this user.'));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, getBlogs, 'All blogs found successfully for this user.'));
});

/*
    Controller function to add a blog.
    Handles the HTTP POST request to add a blog.

    @param {Object} req - The HTTP request object.
    @param {Object} res - The HTTP response object.
    @returns {Object} HTTP response with JSON data.
*/
const addBlog = asyncHandler(async (req, res) => {

    const { id } = req.user;
    const { title, description } = req.body;

    if (!title || !description) {
        throw new ApiError(400, 'Title and description are required.');
    }

    const thumbnailPath = req.file?.path;
    if (!thumbnailPath) {
        throw new ApiError(400, 'A thumbnail file path must be provided.');
    }

    const thumbnail = await uploadOnCloudinary(thumbnailPath);
    if (!thumbnail) {
        throw new ApiError(400, 'Error uploading thumbnail to Cloudinary.');
    }

    const newBlog = await Blog.create({
        thumbnail: thumbnail.url,
        title,
        description,
        user: id
    });
    if (!newBlog) {
        throw new ApiError(500, 'Failed to create the blog. Please try again.');
    }

    return res
        .status(201)
        .json(new ApiResponse(201, newBlog, 'Blog added successfully.'));
});


/*
    Controller function to edit a blog.
    Handles the HTTP PUT request to update a blog based on blogId.

    @param {Object} req - The HTTP request object.
    @param {Object} res - The HTTP response object.
    @returns {Object} HTTP response with JSON data.
*/
const updateBlog = asyncHandler(async (req, res) => {

    const { blogId } = req.params;
    const { title, description } = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog) {
        throw new ApiError(404, 'Blog not found with the specified ID.');
    }

    const thumbnailPath = req.file?.path;
    if (thumbnailPath) {
        if (blog.thumbnail && blog.thumbnail.url) {
            await removeFromCloudinary(blog.thumbnail.url);
        }
        const thumbnail = await uploadOnCloudinary(thumbnailPath);
        if (!thumbnail) {
            throw new ApiError(400, 'Error uploading thumbnail to cloudinary.');
        }
        blog.thumbnail = thumbnail.url;
    }

    if(title) blog.title = title;
    if(description) blog.description = description;

    const updatedBlog = await blog.save();
    if (!updatedBlog) {
        throw new ApiError(404, 'Something went wrong, Please try again.');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedBlog, 'Blog updated successfully.'));
});


/*
    Controller function to delete a blog.
    Handles the HTTP DELETE request to delete a blog based on blogId.

    @param {Object} req - Express request object.
    @param {Object} res - Express response object.
    @returns {Object} JSON response indicating success or failure.
*/
const deleteBlog = asyncHandler(async (req, res) => {

    const { blogId } = req.params;

    const deleteBlog = await Blog.findByIdAndDelete(blogId);
    if(!deleteBlog) {
        throw new ApiError(404, 'Blog not found with the specified ID.');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { deleteBlogId: blogId }, "Blog deleted successfully."));
});

// Exporting functions related to blog management
export { getAllBlogs, getBlogs, addBlog, updateBlog, deleteBlog };

