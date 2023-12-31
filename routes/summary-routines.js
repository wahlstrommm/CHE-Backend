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

router.get("/", function (req, res, next) {
  // Specify the path to the "summary" folder
  var summaryFolderPath = path.join(__dirname, "..", "routines", "summary");

  // Create the "summary" folder if it doesn't exist
  if (!fs.existsSync(summaryFolderPath)) {
    fs.mkdirSync(summaryFolderPath);
  }

  try {
    // Specify the path to the "summary" JSON file
    var statisticsFilePath = path.join(summaryFolderPath, "statistics.json");

    // Read all routines from different folders
    var allRoutines = [];

    ["opening", "closing", "special", "weekly", "monthly"].forEach((folder) => {
      var folderPath = path.join(__dirname, "..", "routines", folder);
      var files = fs.readdirSync(folderPath);

      files.forEach((file) => {
        var routine = readJSONFile(path.join(folderPath, file));
        allRoutines.push(routine);
      });
    });

    // Organize routines by month > week > day
    var organizedRoutines = [];

    allRoutines.forEach((routine) => {
      var month = routine.month; // Replace with the actual property for month
      var week = routine.week; // Replace with the actual property for week

      var existingMonth = organizedRoutines.find((m) => m.month === month);

      if (!existingMonth) {
        existingMonth = { month, weeks: [] };
        organizedRoutines.push(existingMonth);
      }

      var existingWeek = existingMonth.weeks.find((w) => w.week === week);

      if (!existingWeek) {
        existingWeek = { week, days: [] };
        existingMonth.weeks.push(existingWeek);
      }

      existingWeek.days.push(routine);
    });

    // Write organized routines to a JSON file
    writeJSONFile(statisticsFilePath, organizedRoutines);

    res.json({
      success: true,
      message: "Routines processed successfully",
      routines: organizedRoutines,
    });
  } catch (error) {
    console.log("Error processing routines", error);
    res.status(500).json({ error: "Failed to process routines" });
  }
});

module.exports = router;
