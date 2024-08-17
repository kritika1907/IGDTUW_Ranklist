let router = require("express").Router();

let LoginRouter = require("./LoginRouter");
let SignupRouter = require("./SignupRouter");
let DashboardRouter = require("./DashboardRouter");
let LogoutRouter = require("./LogoutRouter");
let RankListRouter = require("./RanklistRouter")
let SearchResult=require("./CourseRoutes/McaRouter");

router.use("/login", LoginRouter);
router.use("/signup", SignupRouter);
router.use("/dashboard",IsAuthenticated, DashboardRouter);
router.use("/logout",IsAuthenticated, LogoutRouter);
router.use("/ranklist",IsAuthenticated,RankListRouter);
router.use("/searchResult",IsAuthenticated,SearchResult )


/**
 * Middleware function to check if the user is authenticated.
 * If the user is authenticated, calls the next middleware.
 * If not authenticated, redirects to the login page.
 * @function IsAuthenticated
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
function IsAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    res.redirect('/login'); // Redirect to login if not authenticated
  }
}

module.exports = router;
