const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");

let latestWeeklyData = null;

function getWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return weekNumber;
}

function getWeeklyFilePath(date) {
  const fileName = `${date.toISOString().split("T")[0]}-weekly-${getWeek(
    date
  )}.json`;
  return path.join(__dirname, "..", "routines", "weekly", fileName);
}

function getTemplateFilePath(date) {
  const fileName = `${date.toISOString().split("T")[0]}-weekly-${getWeek(
    date
  )}.json`;
  return path.join(__dirname, "..", "routines", "template", "weekly.json");
}

async function readDataFromFilePath(filePath, res, today) {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");

    const jsonData = JSON.parse(fileContent);
    latestWeeklyData = jsonData;
    res.json(jsonData);
  } catch (error) {
    console.log("Error parsing file content", error);
    res.status(500).json({ error: "Failed to parse file content" });
  }
}

router.post("/", async function (req, res, next) {
  try {
    const today = new Date();
    const weeklyFilePath = getWeeklyFilePath(today);

    if (await fs.access(weeklyFilePath).catch(() => false)) {
      const existingData = await fs.readFile(weeklyFilePath, "utf-8");
      const existingJson = JSON.parse(existingData);

      Object.assign(existingJson, req.body);

      await fs.writeFile(weeklyFilePath, JSON.stringify(existingJson));
      console.log("Successfully updated weekly file:", weeklyFilePath);
      res.status(200).json({ success: true });
    } else {
      const templateFilePath = getTemplateFilePath();

      if (await fs.access(templateFilePath).catch(() => false)) {
        const templateData = await fs.readFile(templateFilePath, "utf-8");
        const templateJson = JSON.parse(templateData);

        await fs.writeFile(weeklyFilePath, JSON.stringify(templateJson));
        console.log("Successfully copied template to weekly:", weeklyFilePath);
        res.status(200).json({ success: true });
      } else {
        res.status(500).json({ error: "Template file not found" });
      }
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async function (req, res, next) {
  try {
    const today = new Date();
    const weeklyFilePath = getWeeklyFilePath(today);

    if (latestWeeklyData) {
      res.json(latestWeeklyData);
    } else {
      await readDataFromFilePath(weeklyFilePath, res, today);
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;

/*
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
*/

/* 
router.post(
  ("/",
  function (req, res, next) {
    var today = new Date();
    var weekNumber = getWeek(today);

    // Använd veckonumret i filnamnet
    var fileName =
      today.toISOString().split("T")[0].slice(0, 7) +
      "-weekly-" +
      weekNumber +
      ".json";
  })
);
*/
