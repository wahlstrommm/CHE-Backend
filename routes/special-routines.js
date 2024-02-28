var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/", function (req, res, next) {
  var today = new Date();
  var fileName = today.toISOString().split("T")[0] + "-special" + ".json";

  // Ange sökvägen till mappen "opening"
  var specialFolderPath = path.join(__dirname, "..", "routines", "special");
  var specialFilePath = path.join(openingFolderPath, fileName);

  // Kontrollera om filen för dagens datum finns i "opening"
  if (fs.existsSync(specialFilePath)) {
    // Läs innehållet från den befintliga filen i "opening"
    var fileContent = fs.readFileSync(specialFilePath, "utf-8");
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
    // Filen för dagens datum finns inte i "opening", hämta från "template"
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
      // Filen för dagens datum finns inte i "template" heller, skicka innehållet från opening.json
      res.json(require("../routines/template/special.json"));
    }
  }
});
router.post(
  ("/",
  function (req, res, next) {
    var filen = req.body;
    var today = new Date();

    var fileName = today.toISOString().split("T")[0] + "-special" + ".json";

    // Ange sökvägen till mappen "special"
    var specialFolderPath = path.join(__dirname, "..", "routines", "special");
    var specialFilePath = path.join(specialFolderPath, fileName);

    var existingData = fs.readFileSync(specialFilePath, "utf-8");
    if (fs.existsSync(specialFilePath)) {
      try {
        // Försök att konvertera den befintliga datan till ett JSON-objekt
        var existingJson = JSON.parse(existingData);

        // Lägg till den nya informationen till den befintliga datan
        Object.assign(existingJson, fillen);

        // Konvertera tillbaka till JSON-sträng
        const updatedJsonString = JSON.stringify(existingJson);

        // Skriv till filen i "special"
        fs.writeFile(specialFilePath, updatedJsonString, (err) => {
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
