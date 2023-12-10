var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");

function readJSONFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading JSON file ${filePath}: ${error.message}`);
    return null;
  }
}

router.get("/", function (req, res, next) {
  // Ange sökvägarna till mapparna "opening", "closing", och "summary"
  var openingFolderPath = path.join(__dirname, "..", "routines", "opening");
  var closingFolderPath = path.join(__dirname, "..", "routines", "closing");
  var summaryFolderPath = path.join(__dirname, "..", "routines", "summary");

  // Skapa "summary"-mappen om den inte redan finns
  if (!fs.existsSync(summaryFolderPath)) {
    fs.mkdirSync(summaryFolderPath);
  }

  try {
    // Hämta alla filnamn från "opening" och "closing"
    var openingFiles = fs.readdirSync(openingFolderPath);
    var closingFiles = fs.readdirSync(closingFolderPath);

    // Loopa igenom och kopiera filerna till "summary"-mappen
    openingFiles.forEach(function (file) {
      var sourcePath = path.join(openingFolderPath, file);
      var destinationPath = path.join(summaryFolderPath, file);
      fs.copyFileSync(sourcePath, destinationPath);
    });

    closingFiles.forEach(function (file) {
      var sourcePath = path.join(closingFolderPath, file);
      var destinationPath = path.join(summaryFolderPath, file);
      fs.copyFileSync(sourcePath, destinationPath);
    });

    res.json({ success: true, message: "Routines copied to summary folder" });
  } catch (error) {
    console.log("Error copying routines to summary folder", error);
    res
      .status(500)
      .json({ error: "Failed to copy routines to summary folder" });
  }
});

module.exports = router;
