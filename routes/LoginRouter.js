let express = require("express");
let router = express.Router();
let httpStatus = require("http-status-codes").StatusCodes;
let loginService = require("../service/LoginService");
let joi = require("joi");
/**
 * GET /: Renders the login view if the user is not logged in; otherwise, redirects to the dashboard.
 */
router.get("/", (req, res) => {
    // Check if user is already logged in
    if (req.session.user) {
        // Redirect to the dashboard
        res.redirect("/dashboard");
    } else {
        // If not logged in, render the login view
        res.render("login_view/LoginView");
    }
});

/**
 * POST /: Handles user login. Validates input using Joi, authenticates the user, and sets session data.
 */
router.post("/", (req, res) => {
    try {
        // Input validation schema using Joi
        let schema = joi.object({
            email : joi.string().email().required(),
            password : joi.string().min(global.constants.MIN_PASSWORD_LENGTH).required(),
        });

        // Validate request body against the schema
        let { error } = schema.validate(req.body);

        if (error) {
            // Validation failed
            return res.status(httpStatus.BAD_REQUEST).json({ message : error.details[0].message });
        }

        // Destructure email and password from the request body
        let { email, password } = req.body;

        // Authenticate user using LoginService, with a timeout
        global.utils
            .PromiseWithTimeout(
                global.appConfig.DATA_PROCESSING_TIMEOUT,
                loginService.LoginUser(email, password),
                global.messages.DATA_PROCESSING_TIMEOUT
            )
            .then(({ timedOut, message, result }) => {
                let status = timedOut ? httpStatus.REQUEST_TIMEOUT : httpStatus.OK;
                // Set session data for the authenticated user
                if (message == global.messages.LOGIN_SUCCESSFUL) {
                    req.session.user = {
                        username : req.body.email,
                    };
                }

                res.status(status).json({
                    message : message,
                    result : result,
                });
            })
            .catch((e) => {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message : e.message });
            });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message : 'Internal Server Error' });
    }
});

module.exports = router;
