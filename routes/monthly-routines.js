var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");

router.get(
  ("/",
  function (req, res, next) {
    var today = new Date();
    var fileName = today.toISOString().split("T")[0] + "-monthly" + ".json";

    // Ange sökvägen till mappen "Monthly"
    var monthlyFolderPath = path.join(__dirname, "..", "routines", "monthly");
    var monthlyFilePath = path.join(weeklyFolderPath, fileName);

    if (fs.existsSync(monthlyFilePath)) {
      var existingData = fs.readFileSync(monthlyFilePath, "utf-8");
    } else {
    }
  })
);

router.post(("/", function (req, res, next) {}));
module.exports = router;
