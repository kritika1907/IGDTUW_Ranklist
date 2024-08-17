let express = require("express");
let router = express.Router();
let httpStatus = require("http-status-codes").StatusCodes;

/**
 * GET /: Logs out the user by destroying the session and redirects to the login page.
 */
router.get("/", (req, res) => {
    try {
        // Check if user is already logged in
        if (req.session.user) {
            // Destroy the session on logout
            req.session.destroy(() => {
                // On successful logout redirect to login page
                res.redirect('/login');
            });
        } else {
            // User not logged in, return a bad request with an error message
            res.status(httpStatus.BAD_REQUEST).json({ message : global.messages.FAILED_LOGOUT });
        }
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message : 'Internal Server Error' });
    }
});

module.exports = router;
