// Import necessary modules

// Router object for defining routes
import { Router } from 'express';

// Import controller functions
import {
    registerUser,
    loginUser,
    logoutUser,
    verifyEmail,
    resendVerificationEmail,
    changePassword,
    forgotPassword,
    resetPassword,
    userDetails
} from '../controllers/user.controller.js';

// Middleware for authentication
import isLoggedIn from '../middlewares/auth.middleware.js';

// Create a new router instance
const router = Router();

// Route for user registration
router.post('/register', registerUser);
// Route for user login
router.post('/login', loginUser);
// Route for user logout
router.get('/logout', isLoggedIn, logoutUser);
// Route for verify email using the token
router.post('/verify-email/:emailToken', verifyEmail);
// Route for resend verification email
router.post('/resend-verification-email', isLoggedIn, resendVerificationEmail);
// Route for changing user password
router.post('/change-password', isLoggedIn, changePassword);
// Route for requesting a password reset
router.post('/forgot-password', isLoggedIn, forgotPassword);
// Route for resetting password using the token
router.post('/reset-password/:resetPassword', isLoggedIn, resetPassword);
// Route for fetching user details
router.get('/user-details', isLoggedIn, userDetails);

// Export default this router object
export default router;