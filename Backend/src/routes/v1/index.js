const express = require("express");
const todoRoute = require("./todo.route");
const captureDateMiddleware = require("../../middleware/middleware");
const router = express.Router();

router.use("/todos", todoRoute);
//router.use(captureDateMiddleware); // only when we route to test this middleware works

// Uncomment in Milestone 5
// const testRoute = require("./test.route");
// router.use("/test", testRoute);

module.exports = router;
