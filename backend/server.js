const express = require("express");
const http = require("http");
const { mqttClient, mqttData } = require("./mqtt/mqttClient");


// Setup Express server
const app = express();
const server = http.createServer(app);
const port = 5000;


// Add a simple HTML endpoint to display the data
app.get("/", (req, res) => {
  // Render a simple HTML page with the current MQTT data
  res.send(`
    <html>
      <head>
        <title>MQTT Data</title>
      </head>
      <body>
        <h1>Latest MQTT Data</h1>
        <p><strong>Temperature:</strong> ${mqttData.temperature || "N/A"}</p>
        <p><strong>Humidity:</strong> ${mqttData.humidity || "N/A"}</p>
        <p><strong>Light:</strong> ${mqttData.light || "N/A"}</p>
        <p><strong>Soil Moisture:</strong> ${mqttData.moisture || "N/A"}</p>
        <p><em>Data is updated in real-time via MQTT messages!</em></p>
      </body>
    </html>
  `);
});

// Start HTTP server
server.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
  console.log(`You can access the status page at http://localhost:${port}`);
});
