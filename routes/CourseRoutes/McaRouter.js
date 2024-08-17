let express = require("express");
let router = express.Router();
let httpStatus = require("http-status-codes").StatusCodes;
let searchResultService = require("../../service/SearchResultService");
let joi = require("joi");

/**
 * GET /: Renders the login view if the user is not logged in; otherwise, redirects to the dashboard.
 */

router.get("/", (req, res) => {
    // Check if user is already logged in
    if (req.session.user) {
        res.render("ranklists/mca/Mca");
    } else {
        // If not logged in, render the login view
        res.render("login_view/LoginView");
    }
});

/**
 * POST /: Handles search result. Validates input using Joi, authenticates the user, and sets session data.
 */
router.post("/", (req, res) => {
    try {
        // Input validation schema using Joi
        let schema = joi.object({
            batch : joi.string().required(),
            sem: joi.string().required()
        });

        // Validate request body against the schema
        let { error } = schema.validate(req.body);

        if (error) {
            // Validation failed
            return res.status(httpStatus.BAD_REQUEST).json({ message : error.details[0].message });
        }

        // Destructure email and password from the request body
        let {batch, sem } = req.body;

        // Authenticate user using LoginService, with a timeout
        global.utils
            .PromiseWithTimeout(
                global.appConfig.DATA_PROCESSING_TIMEOUT,
                searchResultService.SearchResult(batch, sem),
                global.messages.DATA_PROCESSING_TIMEOUT
            )
            .then(({ timedOut, message, result }) => {
                let status = timedOut ? httpStatus.REQUEST_TIMEOUT : httpStatus.OK;
                res.status(status).json({
                    message : message,
                    result : result,
                });
            })
            .catch((e) => {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message : e.message });
            });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message : 'Internal Server Error' });
    }
});

module.exports = router;
