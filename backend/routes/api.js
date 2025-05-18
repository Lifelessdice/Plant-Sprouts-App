const express = require("express");
const router = express.Router();
const { mqttData } = require("../mqtt/mqttClient");
const { verifyIdToken } = require("../firebase/firebase");

// Serve MQTT data
router.get("/status", (req, res) => {
  res.json(mqttData);
});

let registeredUID = null;

// POST /register-uid — store UID in memory
router.post("/register-uid", (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ error: "UID is required" });
  }

  registeredUID = uid;
  console.log("✅ UID registered and stored:", uid);

  res.json({ message: "UID stored in memory" });
});



module.exports = router;