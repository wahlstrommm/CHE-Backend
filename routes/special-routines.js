var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");

router.get(
  ("/",
  function (req, res, next) {
    var today = new Date();
    var fileName = today.toISOString().split("T")[0] + "-special" + ".json";
    var specialFolderPath = path.join(__dirname, "..", "routines", "special");
    var specialFilePath = path.join(specialFolderPath, fileName);
    if (fs.existsSync(specialFilePath)) {
      var fileContent = fs.readFileSync(specialFilePath, "utf-8");
      try {
        // Försök att konvertera filens innehåll till ett JSON-objekt
        var jsonData = JSON.parse(fileContent);
        res.json(jsonData);
      } catch (error) {
        console.log("Error parsing file content", error);
        res.status(500).json({ error: "Failed to parse file content" });
      }
    } else {
      var templateFilePath = path.join(
        __dirname,
        "..",
        "routines",
        "template",
        fileName
      );
      console.log(templateFilePath);
      if (fs.existsSync(templateFilePath)) {
        var templateFileContent = fs.readFileSync(templateFilePath, "utf-8");
        try {
          // Försök att konvertera filens innehåll till ett JSON-objekt
          var templateJsonData = JSON.parse(templateFileContent);
          res.json(templateJsonData);
        } catch (error) {
          console.log("Error parsing template file content", error);
          res
            .status(500)
            .json({ error: "Failed to parse template file content" });
        }
      } else {
        res.json(require("../special.json"));
      }
    }
  })
);
router.post(
  ("/",
  function (req, res, next) {
    var filen = req.body;
    var today = new Date();
  })
);
module.exports = router;
