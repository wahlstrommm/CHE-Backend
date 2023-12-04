var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");

router.get(
  ("/",
  function (req, res, next) {
    var today = new Date();
    var fileName = today.toISOString().split("T")[0] + "-special" + ".json";
    var specialFolderPath = path.join(__dirname, "..", "routines", "opening");
  })
);
router.post(("/", function (req, res, next) {}));
module.exports = router;
