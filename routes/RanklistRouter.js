let router = require("express").Router();
let McaRouter = require("./CourseRoutes/McaRouter")
router.use("/mca", McaRouter)
module.exports = router;