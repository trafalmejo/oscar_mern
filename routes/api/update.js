const express = require("express");
const router = express.Router();

// @route POST request api/update
// @desc Check for updates from Server
// @access Public
router.post("/", (req, res) => {
  let update = {};
  //update.title = "Update test";
  //update.content = "<h1>Test</h1>";
  //If update is empty There is no popUp
  res.json(update);
});

module.exports = router;
