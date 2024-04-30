/*
    Middleware to handle asynchronous route handlers
    @param {function} fn - Asynchronous route handler function
    @returns {function} - Asynchronous route handler with error handling
*/
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise
        .resolve(fn(req, res, next))
        // Handle errors and send appropriate response
        .catch((error) => {
            res
            .status(error.status || 500)
            .json({
                success: false,
                message: error.message
            });
        });
    }
};

// Export default the asyncHandler middleware
export default asyncHandler;