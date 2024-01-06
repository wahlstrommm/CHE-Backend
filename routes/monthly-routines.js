var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/", function (req, res, next) {
  var today = new Date();
  var fileName = today.toISOString().split("T")[0] + "-monthly" + ".json";
  console.log(fileName);
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

router.post("/", function (req, res, next) {
  var fillen = req.body;
  console.log(fillen);
  // Skapa ett Date-objekt för dagens datum
  var today = new Date();

  // Skapa ett filnamn med månadens nummer och år
  var fileName =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-monthly" + ".json";

  // Ange sökvägen till mappen "monthly"
  var monthlyFolderPath = path.join(__dirname, "..", "routines", "monthly");
  var monthlyFilePath = path.join(monthlyFolderPath, fileName);

  // Kontrollera om filen redan finns i "monthly"
  if (fs.existsSync(monthlyFilePath)) {
    // Läs in den befintliga filens data i "monthly"
    var existingData = fs.readFileSync(monthlyFilePath, "utf-8");

    try {
      // Försök att konvertera den befintliga datan till ett JSON-objekt
      var existingJson = JSON.parse(existingData);

      // Lägg till den nya informationen till den befintliga datan
      Object.assign(existingJson, fillen);

      // Konvertera tillbaka till JSON-sträng
      const updatedJsonString = JSON.stringify(existingJson);

      // Skriv till filen i "monthly"
      fs.writeFile(monthlyFilePath, updatedJsonString, (err) => {
        if (err) {
          console.log("Error updating file", err);
          res.status(500).json({ error: "Failed to update file" });
        } else {
          console.log("Successfully updated file:", monthlyFilePath);
          res.status(200).json({ success: true });
        }
      });
    } catch (error) {
      console.log("Error parsing existing file data", error);
      res.status(500).json({ error: "Failed to parse existing file data" });
    }
  } else {
    // Filen finns inte i "monthly", så kolla i "template"
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
        Object.assign(templateExistingJson, fillen);

        // Konvertera tillbaka till JSON-sträng
        const templateUpdatedJsonString = JSON.stringify(templateExistingJson);

        // Skriv till filen i "template"
        fs.writeFile(templateFilePath, templateUpdatedJsonString, (err) => {
          if (err) {
            console.log("Error updating template file", err);
            res.status(500).json({ error: "Failed to update template file" });
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
        res
          .status(500)
          .json({ error: "Failed to parse template existing file data" });
      }
    } else {
      // Filen finns inte i "template" heller, skapa en ny fil i "monthly"
      const jsonString = JSON.stringify(fillen);
      fs.writeFile(monthlyFilePath, jsonString, (err) => {
        if (err) {
          console.log("Error writing file", err);
          res.status(500).json({ error: "Failed to write file" });
        } else {
          console.log("Successfully wrote new file:", monthlyFilePath);
          res.status(200).json({ success: true });
        }
      });
    }
  }
});

module.exports = router;
