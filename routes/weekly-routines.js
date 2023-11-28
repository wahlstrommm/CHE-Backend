var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/", function (req, res, next) {
  var today = new Date();
  var fileName = today.toISOString().split("T")[0] + "-weekly" + ".json";

  // Ange sökvägen till mappen "weekly"
  var weeklyFolderPath = path.join(__dirname, "..", "routines", "weekly");
  var weeklyFilePath = path.join(weeklyFolderPath, fileName);

  // Kontrollera om filen för dagens datum finns i "weekly"
  if (fs.existsSync(weeklyFilePath)) {
    // Läs innehållet från den befintliga filen i "weekly"
    var fileContent = fs.readFileSync(weeklyFilePath, "utf-8");
    try {
      // Försök att konvertera filens innehåll till ett JSON-objekt
      var jsonData = JSON.parse(fileContent);
      res.json(jsonData);
    } catch (error) {
      console.log("Error parsing file content", error);
      res.status(500).json({ error: "Failed to parse file content" });
    }
  } else {
    // Filen för dagens datum finns inte i "weekly", hämta från "template"
    var templateFilePath = path.join(
      __dirname,
      "..",
      "routines",
      "template",
      fileName
    );

    if (fs.existsSync(templateFilePath)) {
      // Läs innehållet från den befintliga filen i "template"
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
      // Filen för dagens datum finns inte i "template" heller, skicka innehållet från weekly.json
      res.json(require("../routines/template/weekly.json"));
    }
  }
});
router.post(("/", function (req, res, next) {}));
module.exports = router;
