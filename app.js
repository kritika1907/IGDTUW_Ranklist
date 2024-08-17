let express = require("express");
let indexRouter = require("./routes/IndexRouter.js");
const httpStatus = require("http-status-codes").StatusCodes;

let app = express();
let session = require('express-session');

/**
 * Middleware for handling JSON and URL-encoded data.
 */
app.use(express.json());
app.use(express.urlencoded({ extended : false }));

// view engine setup
app.set("views", global.path.join(global.appBasePath, "views"));
app.set("view engine", "pug");

/**
 * Middleware for serving static files from the public directory.
 */
app.use(express.static(global.path.join(global.appBasePath, "public")));
app.use("/views", express.static(global.path.join(global.appBasePath, "views")));
app.locals.basedir = app.get("views");

/**
 * Middleware for setting up session handling with express-session.
 */
app.use(session({
  secret : global.constants.SESSION_SECRET_KEY,
  resave : false,
  saveUninitialized : true,
  cookie : { secure : false },
}));

/**
 * Middleware for handling routes using the IndexRouter.
 */
app.use(global.constants.BASE_URL, indexRouter);

/**
 * Catch-all route for handling 404 errors.
 */
app.use(function (req, res, next) {
  if (res.statusCode == httpStatus.OK) {
    res.status(httpStatus.NOT_FOUND);
    res.message = "No route Found";
  }
  next();
});

/**
 * Error handling middleware.
 */
app.use(async (req, res) => {
  let error = {};
  error.status = req.status;
  res.locals.error = req.app.get("env") === "development" ? res.message : {};
  if (req.is("application/json") && res.statusCode != httpStatus.INTERNAL_SERVER_ERROR) {
    res.status(httpStatus.BAD_REQUEST);
    res.json({
      heading : res.statusCode,
      error : res.message
    });
  } else {
    res.json({
      heading : res.statusCode,
      error : res.message
    });
  }
});

module.exports = app;
