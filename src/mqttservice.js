import { Client } from "paho-mqtt";

// Initialize MQTT Client
const clientId = "mqtt_" + Math.random().toString(16).slice(2, 10);
const client = new Client("broker.hivemq.com", 8000, clientId);

// Topic handler map
let topicHandlers = {};

// Store the latest values for later use
let dataStore = {
  temperature: null,
  humidity: null,
  light: null,
  soil: null,
};

// Setup event handler for incoming messages
client.onMessageArrived = (message) => {
  const topic = message.destinationName;
  const payload = message.payloadString;

  // Check if a handler exists for the topic
  if (topicHandlers[topic]) {
    console.log("📩 Message received:");
    console.log("  ➤ Topic:", topic);
    console.log("  ➤ Payload:", payload);

    // Update dataStore directly
    if (topic === "CROWmium/rtl8720dn/temperature") {
      dataStore.temperature = parseFloat(payload);
    } else if (topic === "CROWmium/rtl8720dn/humidity") {
      dataStore.humidity = parseFloat(payload);
    } else if (topic === "CROWmium/rtl8720dn/light") {
      dataStore.light = parseInt(payload);
    } else if (topic === "CROWmium/rtl8720dn/moisture") {
      dataStore.soil = parseInt(payload);
    }

    // Execute the handler for the topic
    topicHandlers[topic](payload);
  }
};

// Optional: Handle connection loss
client.onConnectionLost = (responseObject) => {
  if (responseObject.errorCode !== 0) {
    console.log("🔌 Connection lost:", responseObject.errorMessage);
  }
};

// Function to set a handler for a specific topic
const setHandlerForTopic = (topic, callback) => {
  topicHandlers[topic] = callback;
};

// Connect to the broker and subscribe to topics automatically
const connect = () => {
  client.connect({
    onSuccess: () => {
      console.log("Connected to HiveMQ");

      const topics = [
        "CROWmium/rtl8720dn/temperature",
        "CROWmium/rtl8720dn/humidity",
        "CROWmium/rtl8720dn/light",
        "CROWmium/rtl8720dn/moisture",
      ];

      topics.forEach((topic) => {
        client.subscribe(topic);
        console.log(`Subscribed to topic: ${topic}`);
      });

      // Register handlers for each topic
      setHandlerForTopic("CROWmium/rtl8720dn/temperature", (payload) => {
        console.log("Temperature:", payload);
      });

      setHandlerForTopic("CROWmium/rtl8720dn/humidity", (payload) => {
        console.log("Humidity:", payload);
      });

      setHandlerForTopic("CROWmium/rtl8720dn/light", (payload) => {
        console.log("Light Intensity:", payload);
      });

      setHandlerForTopic("lifelessdice/soil", (payload) => {
        console.log("Soil Moisture:", payload);
      });
    },
    onFailure: (error) => {
      console.log("HiveMQ Connection Failed", error);
    },
    useSSL: false,
    reconnect: true,
  });
};

// Export functions
export { connect, dataStore, setHandlerForTopic };
