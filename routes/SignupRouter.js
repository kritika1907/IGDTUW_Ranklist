let express = require("express");
let router = express.Router();
let httpStatus = require("http-status-codes").StatusCodes;
let signupService = require("../service/SignupService");
let joi = require("joi");

/**
 * GET /: Renders the signup view if the user is not logged in; otherwise, redirects to the dashboard.
 */
router.get("/", (req, res) => {
    // Check if user is already logged in
    if (req.session.user) {
        // Redirect to the dashboard
        res.redirect("/dashboard");
    } else {
        res.render("signup_view/SignupView");
    }
    // Render the signup view if not logged in
});

/**
 * POST /: Handles user signup. Validates input using Joi, registers the user, and processes the result.
 */
router.post("/", (req, res) => {
    try {
        // Input validation schema using Joi
        let schema = joi.object({
            name: joi.string().required(),
            email: joi.string().email().required(),
            password: joi.string().min(global.constants.MIN_PASSWORD_LENGTH).required(),
            role: joi.string().valid('admin', 'dean', 'placement_head').required(), // Include role validation
        });

        // Validate request body against the schema
        let { error } = schema.validate(req.body);

        if (error) {
            // Validation failed
            return res.status(httpStatus.BAD_REQUEST).json({ message: error.details[0].message });
        }

        // Destructure name, email, password, and role from the request body
        let { name, email, password, role } = req.body;

        // Register user using SignupService, with a timeout
        global.utils
            .PromiseWithTimeout(
                global.appConfig.DATA_PROCESSING_TIMEOUT,
                signupService.RegisterUser(name, email, password, role), // Pass role to RegisterUser
                global.messages.DATA_PROCESSING_TIMEOUT
            )
            .then(({ timedOut, message, result }) => {
                let status = timedOut ? httpStatus.REQUEST_TIMEOUT : httpStatus.OK;
                res.status(status).json({
                    message: message,
                    result: result,
                });
            })
            .catch((e) => {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
            });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
