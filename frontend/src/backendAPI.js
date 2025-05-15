import axios from 'axios';

// Store the latest values
let dataStore = {
  temperature: null,
  humidity: null,
  light: null,
  moisture: null,
};

// Fetch data from the proxy server
const fetchDataFromServer = async () => {
  console.log("🛰️ Fetching data from proxy server...");

  try {
    const { data } = await axios.get('https://mqtt-proxy-server.onrender.com/api/status');
    console.log("🌐 Data fetched:", data);

    // Update the data store with the fetched data
    Object.assign(dataStore, {
      temperature: data.temperature,
      humidity: data.humidity,
      light: data.light,
      moisture: data.moisture,
    });

    console.log("📊 Updated Data:", dataStore);
    
  } catch (error) {
    console.error("❌ Error fetching data:", error.message);
  }
};

// Poll every 5 seconds
setInterval(fetchDataFromServer, 5000);

// Initial fetch
fetchDataFromServer();

export { fetchDataFromServer, dataStore };
