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
      var fileContent = fs.readFileSync(monthlyFilePath, "utf-8");

      try {
        var jsonData = JSON.parse(fileContent);
        res.json(jsonData);
        // Lägg till den nya informationen till den befintliga datan
      } catch (error) {
        console.log("Error parsing file content", error);
        res.status(500).json({ error: "Failed to parse file content" });
      }
    } else {
    }
  })
);

router.post(("/", function (req, res, next) {}));
module.exports = router;
