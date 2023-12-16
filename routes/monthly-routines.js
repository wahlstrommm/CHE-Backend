var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/", function (req, res, next) {
  var today = new Date();
  var fileName = today.toISOString().split("T")[0] + "-monthly" + ".json";

  // Ange sökvägen till mappen "monthly"
  var monthlyFolderPath = path.join(__dirname, "..", "routines", "monthly");
  var monthlyFilePath = path.join(monthlyFolderPath, fileName);

  // Kontrollera om filen för dagens datum finns i "monthly"
  if (fs.existsSync(monthlyFilePath)) {
    // Läs innehållet från den befintliga filen i "monthly"
    var fileContent = fs.readFileSync(monthlyFilePath, "utf-8");
    try {
      // Försök att konvertera filens innehåll till ett JSON-objekt
      var jsonData = JSON.parse(fileContent);
      console.log(jsonData);
      res.json(jsonData);
    } catch (error) {
      console.log("Error parsing file content", error);
      res.status(500).json({ error: "Failed to parse file content" });
    }
  } else {
    // Filen för dagens datum finns inte i "monthly", hämta från "template"
    var templateFilePath = path.join(
      __dirname,
      "..",
      "routines",
      "template",
      fileName
    );
    console.log(templateFilePath);
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
      // Filen för dagens datum finns inte i "template" heller, skicka innehållet från monthly.json
      res.json(require("../routines/template/monthly.json"));
    }
  }
});

router.post(
  ("/",
  function (req, res, next) {
    var today = new Date();

    var fileName =
      today.toISOString().split("T")[0].slice(0, 7) + "-monthly" + ".json";

    var monthlyFolderPath = path.join(__dirname, "..", "routines", "monthly");
    var monthlyFilePath = path.join(monthlyFolderPath, fileName);

    var existingData = fs.readFileSync(monthlyFilePath, "utf-8");
    if (fs.existsSync(monthlyFilePath)) {
      try {
        var existingJson = JSON.parse(existingData);
        Object.assign(existingJson, fillen);
        const updatedJsonString = JSON.stringify(existingJson);

        fs.writeFile(monthlyFilePath, updatedJsonString, (err) => {
          if (err) {
            console.log("Error updating file", err);
            res.status(500).json({ error: "Failed to update file" });
          } else {
            console.log("Successfully updated file:", specialFilePath);
            res.status(200).json({ success: true });
          }
        });
      } catch (error) {
        console.log("Error parsing existing file data", error);
        res.status(500).json({ error: "Failed to parse existing file data" });
      }
    } else {
      var templateFilePath = path.join(
        __dirname,
        "..",
        "routines",
        "template",
        fileName
      );
    }
  })
);
module.exports = router;
