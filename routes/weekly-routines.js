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
  const weekNumber = getWeek(date);
  const fileName = `w-${weekNumber}.json`;
  return path.join(__dirname, "..", "routines", "weekly", fileName);
}

function getTemplateFilePath() {
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

router.get("/", async function (req, res, next) {
  try {
    const today = new Date();
    const weeklyFilePath = getWeeklyFilePath(today);

    if (await fs.access(weeklyFilePath).catch(() => false)) {
      const fileContent = await fs.readFile(weeklyFilePath, "utf-8");
      const jsonData = JSON.parse(fileContent);
      latestWeeklyData = jsonData;
      res.json(jsonData);
    } else {
      const templateFilePath = getTemplateFilePath();
      const templateContent = await fs.readFile(templateFilePath, "utf-8");
      const templateJson = JSON.parse(templateContent);
      res.json(templateJson);
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async function (req, res, next) {
  try {
    const today = new Date();
    const weeklyFilePath = getWeeklyFilePath(today);

    if (await fs.access(weeklyFilePath).catch(() => false)) {
      // Om veckofilen redan finns, uppdatera den med inkommande data
      const existingData = await fs.readFile(weeklyFilePath, "utf-8");
      const existingJson = JSON.parse(existingData);

      Object.assign(existingJson, req.body);
      console.log("Reached this point in the code");

      await fs.writeFile(weeklyFilePath, JSON.stringify(existingJson));
      console.log("Successfully updated weekly file:", weeklyFilePath);
      res.status(200).json({ success: true });
    } else {
      // Om veckofilen inte finns, använd template-filen
      const templateFilePath = getTemplateFilePath();

      if (await fs.access(templateFilePath).catch(() => false)) {
        // Om template-filen finns, kopiera den till veckofilen
        const templateData = await fs.readFile(templateFilePath, "utf-8");
        const templateJson = JSON.parse(templateData);

        await fs.writeFile(weeklyFilePath, JSON.stringify(templateJson));
        console.log("Successfully copied template to weekly:", weeklyFilePath);
        res.status(200).json({ success: true });
      } else {
        // Om template-filen inte finns, skicka en felstatus
        res.status(500).json({ error: "Template file not found" });
      }
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
