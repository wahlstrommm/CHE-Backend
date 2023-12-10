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
function writeJSONFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    console.log(`Data written to ${filePath}`);
  } catch (error) {
    console.error(`Error writing to JSON file ${filePath}: ${error.message}`);
  }
}

// Funktion för att gruppera rutiner efter månad och vecka
function groupRoutinesByMonthAndWeek(routines) {
  // Skapa ett objekt för att hålla den grupperade informationen
  var groupedData = {};

  routines.forEach(function (routine) {
    // Extrahera månad och vecka från rutinens klockslag
    var month = new Date(routine.Klockan).toLocaleString("en-US", {
      month: "long",
    });
    var week = new Date(routine.Klockan).toLocaleString("en-US", {
      week: "numeric",
    });

    // Skapa en nyckel för grupperingen baserat på månad och vecka
    var key = `${month} - Week ${week}`;

    // Om nyckeln inte finns, skapa den
    if (!groupedData[key]) {
      groupedData[key] = [];
    }

    // Lägg till rutinen i rätt grupp
    groupedData[key].push(routine);
  });

  return groupedData;
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
