// Import necessary modules

// Router object for defining routes
import { Router } from 'express';

// Import controller functions
import {
    getAllBlogs,
    getBlogs,
    addBlog,
    updateBlog,
    deleteBlog
} from '../controllers/blog.controller.js';

// Middleware for handling file uploads
import upload from '../middlewares/multer.middleware.js';

// Middleware for authentication
import isLoggedIn from '../middlewares/auth.middleware.js';

// Create a new router instance
const router = Router();

// Route for get all blogs to all the users
router.get('/get-all-blogs', getAllBlogs);
// Route for get all blogs to its owner
router.get('/get-blogs', isLoggedIn, getBlogs);
// Route for add a task
router.post('/add-blog', isLoggedIn, upload.single('thumbnail'), addBlog);
// Route for update task status
router.put('/update-blog/:blogId', isLoggedIn, upload.single('thumbnail'), updateBlog);
// Route for delete a task
router.delete('/delete-blog/:blogId', isLoggedIn, deleteBlog);

// Export default this router object
export default router;