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
      res.json(require("../routines/template/weekly.json"));
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
      const templateData = require("../routines/template/weekly.json");
      res.json(templateData);
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
