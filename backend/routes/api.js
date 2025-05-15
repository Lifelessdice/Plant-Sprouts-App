const express = require("express");
const router = express.Router();
const { mqttData } = require("../mqtt/mqttClient");
const admin = require("../firebase/firebaseAdmin");
const db = admin.firestore();
const auth = admin.auth();

// /api/status route serving MQTT data JSON
router.get("/status", (req, res) => {
  res.json(mqttData);
});

router.post("/verifyUser", async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) {
    return res.status(401).json({ error: "Missing ID token" });
  }

  try {
    //Verify the token
    const decodedTOken = await auth.verifyIdToken(idToken);
    const { uid, email} = decodedTOken;

    console.log("Received token, user verified:", uid, email);

    //Save or update user in Firestore
    const userRef = db.collection("users").doc(uid);
    await userRef.set(
      {
        email,
        lastLogin: new Date(),
      },
      { merge: true }
    );

    res.status(200).json({
      success: true,
      message: "User verified and data stored",\
      uid,
      email,
    });
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(403).json({success: false, error: "Invalid token"});
  }
});



module.exports = router;
