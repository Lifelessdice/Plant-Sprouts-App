import axios from 'axios';

let dataStore = {};  // Stores the sensor data.

// Fetch sensor data + plant statuses
const fetchDashboardData = async () => {
  console.log("Fetching dashboard data from backend...");

  try {
    const { data } = await axios.get('https://mqtt-proxy-server.onrender.com/api/dashboard');

    const { sensorData, plants } = data;

    console.log("Sensor Data Received:", sensorData);
    console.log("Plant Statuses Received:", plants);

    // For each plant, store sensorData + status keyed by plantId
    dataStore = {};
    plants.forEach(({ plantId, status }) => {
      dataStore[plantId] = {
        sensorData,
        status,
      };
    });

    console.log("Updated DataStore keyed by plantId:", dataStore);
    console.log("Dashboard data processed successfully.");
  } catch (error) {
    console.error("Error fetching dashboard data:", error.message);
  }
};

// Initial fetch
fetchDashboardData();

// Poll every 5 seconds
setInterval(fetchDashboardData, 5000);

export { fetchDashboardData, dataStore };
