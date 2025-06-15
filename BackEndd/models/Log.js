const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
      "ADD_PRODUCT",
      "UPDATE_PRODUCT",
      "DELETE_PRODUCT",
      "LOGIN",
      "LOGOUT",
    ],
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  userAgent: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    default: "system",
  },
});

module.exports = mongoose.model("Log", logSchema);
