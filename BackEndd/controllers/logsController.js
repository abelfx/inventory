const Log = require("../models/Log");

// Create a new log entry
exports.createLog = async (req, res) => {
  try {
    console.log("Creating log entry:", req.body);
    const { action, details } = req.body;
    const userAgent = req.headers["user-agent"] || "Unknown";

    const log = new Log({
      action,
      details,
      userAgent,
    });

    await log.save();
    console.log("Log entry created successfully:", log);
    res.status(201).json(log);
  } catch (error) {
    console.error("Error creating log:", error);
    res.status(500).json({ message: "Error creating log entry" });
  }
};

// Get all logs
exports.getAllLogs = async (req, res) => {
  try {
    console.log("Fetching all logs");
    const logs = await Log.find().sort({ timestamp: -1 }).limit(1000);
    console.log(`Found ${logs.length} logs`);
    res.json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ message: "Error fetching logs" });
  }
};

// Get logs by action type
exports.getLogsByAction = async (req, res) => {
  try {
    const { action } = req.params;
    console.log(`Fetching logs for action: ${action}`);
    const logs = await Log.find({ action }).sort({ timestamp: -1 }).limit(1000);
    console.log(`Found ${logs.length} logs for action ${action}`);
    res.json(logs);
  } catch (error) {
    console.error("Error fetching logs by action:", error);
    res.status(500).json({ message: "Error fetching logs by action" });
  }
};

// Clean old logs (older than 30 days)
exports.cleanOldLogs = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    console.log("Cleaning logs older than:", thirtyDaysAgo);
    const result = await Log.deleteMany({
      timestamp: { $lt: thirtyDaysAgo },
    });
    console.log(`Deleted ${result.deletedCount} old logs`);
    res.json({ message: `Deleted ${result.deletedCount} old logs` });
  } catch (error) {
    console.error("Error cleaning old logs:", error);
    res.status(500).json({ message: "Error cleaning old logs" });
  }
};
