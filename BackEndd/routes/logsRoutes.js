const express = require("express");
const router = express.Router();
const logsController = require("../controllers/logsController");

// Create a new log entry
router.post("/", logsController.createLog);

// Get all logs
router.get("/", logsController.getAllLogs);

// Get logs by action type
router.get("/action/:action", logsController.getLogsByAction);

// Clean old logs
router.delete("/clean", logsController.cleanOldLogs);

module.exports = router;
