var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/", function (req, res, next) {
  var today = new Date();
  var fileName = today.toISOString().split("T")[0] + "-opening" + ".json";

  // Ange sökvägen till mappen "opening"
  var openingFolderPath = path.join(__dirname, "..", "routines", "opening");
  var openingFilePath = path.join(openingFolderPath, fileName);

  // Kontrollera om filen för dagens datum finns i "opening"
  if (fs.existsSync(openingFilePath)) {
    // Läs innehållet från den befintliga filen i "opening"
    var fileContent = fs.readFileSync(openingFilePath, "utf-8");
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
      res.json(require("../routines/template/opening.json"));
    }
  }
});

router.post("/", function (req, res, next) {
  var updatedRoutines = req.body;
  console.log(req.body);
  // Skapa ett Date-objekt för dagens datum
  var today = new Date();

  // Skapa ett filnamn med dagens datum
  var fileName = today.toISOString().split("T")[0] + "-opening" + ".json";

  // Ange sökvägen till mappen "opening"
  var openingFolderPath = path.join(__dirname, "..", "routines", "opening");
  var openingFilePath = path.join(openingFolderPath, fileName);

  // Kontrollera om filen redan finns i "opening"
  if (fs.existsSync(openingFilePath)) {
    // Konvertera tillbaka till JSON-sträng
    const updatedJsonString = JSON.stringify({ Rutiner: updatedRoutines });

    // Skriv till filen i "opening"
    fs.writeFile(openingFilePath, updatedJsonString, (err) => {
      if (err) {
        console.log("Error updating file", err);
        res.status(500).json({ error: "Failed to update file" });
      } else {
        console.log("Successfully updated file:", openingFilePath);
        res.status(200).json({ success: true });
      }
    });
  } else {
    // Filen finns inte i "opening", så kolla i "template"
    var templateFilePath = path.join(
      __dirname,
      "..",
      "routines",
      "template",
      fileName
    );

    if (fs.existsSync(templateFilePath)) {
      // Läs in den befintliga filens data i "template"
      var templateExistingData = fs.readFileSync(templateFilePath, "utf-8");

      try {
        // Försök att konvertera den befintliga datan till ett JSON-objekt
        var templateExistingJson = JSON.parse(templateExistingData);

        // Lägg till den nya informationen till den befintliga datan
        Object.assign(templateExistingJson, { Rutiner: updatedRoutines });

        // Konvertera tillbaka till JSON-sträng
        const templateUpdatedJsonString = JSON.stringify(templateExistingJson);

        // Skriv till filen i "template"
        fs.writeFile(templateFilePath, templateUpdatedJsonString, (err) => {
          if (err) {
            console.log("Error updating template file", err);
            res.status(500).json({
              error: "Failed to update template file",
            });
          } else {
            console.log(
              "Successfully updated template file:",
              templateFilePath
            );
            res.status(200).json({ success: true });
          }
        });
      } catch (error) {
        console.log("Error parsing template existing file data", error);
        res.status(500).json({
          error: "Failed to parse template existing file data",
        });
      }
    } else {
      // Filen finns inte i "template" heller, skapa en ny fil i "opening"
      const jsonString = JSON.stringify({ Rutiner: updatedRoutines });
      fs.writeFile(openingFilePath, jsonString, (err) => {
        if (err) {
          console.log("Error writing file", err);
          res.status(500).json({ error: "Failed to write file" });
        } else {
          console.log("Successfully wrote new file:", openingFilePath);
          res.status(200).json({ success: true });
        }
      });
    }
  }
});

module.exports = router;
