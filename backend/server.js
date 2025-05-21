const express = require("express");
const http = require("http");
const admin = require("./firebase/firebaseAdmin"); // full SDK instance
const apiRoutes = require("./routes/api");

const app = express();
const server = http.createServer(app);
const port = 5000;

// Middleware
app.use(express.json());

// Routes
app.use("/api", apiRoutes);



// Server start
server.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
  console.log(`MQTT status: http://localhost:${port}/api/status`);
  console.log(`Firebase test: http://localhost:${port}/firebase-test`);
});
