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

// Funktion för att generera statistik från grupperade data
function generateStatistics(groupedData) {
  var statistics = {};

  // Loopa igenom varje grupp (månad och vecka)
  for (var key in groupedData) {
    var routinesInGroup = groupedData[key];
    var totalRoutines = routinesInGroup.length;
    var completedRoutines = routinesInGroup.filter(
      (routine) => routine.Done
    ).length;

    // Skapa statistik för varje grupp
    statistics[key] = {
      totalRoutines: totalRoutines,
      completedRoutines: completedRoutines,
      completionRate: (completedRoutines / totalRoutines) * 100,
    };
  }

  return statistics;
}

router.get("/", function (req, res, next) {
  // Ange sökvägarna till mapparna "opening", "closing", "special", "weekly", "monthly" och "summary"
  var openingFolderPath = path.join(__dirname, "..", "routines", "opening");
  var closingFolderPath = path.join(__dirname, "..", "routines", "closing");
  var specialFolderPath = path.join(__dirname, "..", "routines", "special");
  var weeklyFolderPath = path.join(__dirname, "..", "routines", "weekly");
  var monthlyFolderPath = path.join(__dirname, "..", "routines", "monthly");
  var summaryFolderPath = path.join(__dirname, "..", "routines", "summary");

  // Skapa "summary"-mappen om den inte redan finns
  if (!fs.existsSync(summaryFolderPath)) {
    fs.mkdirSync(summaryFolderPath);
  }

  try {
    // Hämta alla filnamn från olika mappar
    var openingFiles = fs.readdirSync(openingFolderPath);
    var closingFiles = fs.readdirSync(closingFolderPath);
    var specialFiles = fs.readdirSync(specialFolderPath);
    var weeklyFiles = fs.readdirSync(weeklyFolderPath);
    var monthlyFiles = fs.readdirSync(monthlyFolderPath);

    // Läs alla rutiner från olika mappar
    var openingRoutines = openingFiles.map((file) =>
      readJSONFile(path.join(openingFolderPath, file))
    );
    var closingRoutines = closingFiles.map((file) =>
      readJSONFile(path.join(closingFolderPath, file))
    );
    var specialRoutines = specialFiles.map((file) =>
      readJSONFile(path.join(specialFolderPath, file))
    );
    var weeklyRoutines = weeklyFiles.map((file) =>
      readJSONFile(path.join(weeklyFolderPath, file))
    );
    var monthlyRoutines = monthlyFiles.map((file) =>
      readJSONFile(path.join(monthlyFolderPath, file))
    );

    // Kombinera alla rutiner
    var allRoutines = openingRoutines
      .concat(closingRoutines)
      .concat(specialRoutines)
      .concat(weeklyRoutines)
      .concat(monthlyRoutines);

    // Gruppera rutiner efter månad och vecka
    var groupedData = groupRoutinesByMonthAndWeek(allRoutines);

    // Generera statistik från grupperade data
    var statistics = generateStatistics(groupedData);

    // Skriv statistiken till en JSON-fil
    var statisticsFilePath = path.join(summaryFolderPath, "statistics.json");
    writeJSONFile(statisticsFilePath, statistics);

    res.json({
      success: true,
      message: "Routines processed successfully",
      statistics: statistics,
    });
  } catch (error) {
    console.log("Error processing routines", error);
    res.status(500).json({ error: "Failed to process routines" });
  }
});

module.exports = router;
