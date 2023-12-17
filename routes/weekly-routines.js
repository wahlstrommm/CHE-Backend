const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");
const deepmerge = require("deepmerge");

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

async function readJsonFromFile(filePath) {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.log("Error parsing file content", error);
    throw new Error("Failed to parse file content");
  }
}

async function writeJsonToFile(filePath, jsonData) {
  try {
    await fs.writeFile(filePath, JSON.stringify(jsonData));
    console.log("Successfully updated file:", filePath);
  } catch (error) {
    console.log("Error writing to file", error);
    throw new Error("Failed to write to file");
  }
}

router.get("/", async function (req, res, next) {
  try {
    const today = new Date();
    const weeklyFilePath = getWeeklyFilePath(today);
    let latestWeeklyData;

    if (await fs.access(weeklyFilePath).catch(() => false)) {
      latestWeeklyData = await readJsonFromFile(weeklyFilePath);
      res.json(latestWeeklyData);
    } else {
      const templateFilePath = getTemplateFilePath();
      latestWeeklyData = await readJsonFromFile(templateFilePath);
      res.json(latestWeeklyData);
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

    let jsonData;

    if (await fs.access(weeklyFilePath).catch(() => false)) {
      const existingData = await readJsonFromFile(weeklyFilePath);
      jsonData = deepmerge(existingData, req.body, { arrayMerge: (d, s, o) => s });
    } else {
      jsonData = req.body;
    }

    await writeJsonToFile(weeklyFilePath, jsonData);
    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
