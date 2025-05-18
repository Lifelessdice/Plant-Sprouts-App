#include "rpcWiFi.h"
#include <PubSubClient.h>
#include "Grove_Temperature_And_Humidity_Sensor.h"
#include "TFT_eSPI.h"

// WiFi credentials
const char *ssid = "Octane_5G";
const char *password = "ppap1#23";

// MQTT broker info
const char *mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;

// Sensor setup
#define DHTPIN 2
#define DHTTYPE DHT11
#define SOIL_PIN A0  

DHT dht(DHTPIN, DHTTYPE);

// LED setup
#define BLUE_LED 3
#define RED_LED 4

// MQTT client setup
WiFiClient wifiClient;
PubSubClient client(wifiClient);

// LCD display
TFT_eSPI tft;

// Timing
unsigned long lastMsgTime = 0;

// Smiley face drawing function
void drawSmileyFace() {
    tft.fillScreen(TFT_WHITE); // White background

  // Face
  tft.fillCircle(160, 120, 60, TFT_YELLOW); // Yellow face
  tft.drawCircle(160, 120, 60, TFT_BLACK);  // Black outline

  // Eyes
  tft.fillCircle(145, 105, 5, TFT_BLACK); // Left eye
  tft.fillCircle(175, 105, 5, TFT_BLACK); // Right eye

  // Smile (inverted parabola)
  for (int x = -35; x <= 35; x++) {
    int y = -0.02 * x * x;
    tft.drawPixel(160 + x, 150 + y, TFT_BLACK);
  }
}

// Sad face drawing function
void drawSadFace() {
    tft.fillScreen(TFT_WHITE); // White background

  // Face
  tft.fillCircle(160, 120, 60, TFT_CYAN); // Cyan face
  tft.drawCircle(160, 120, 60, TFT_BLACK);  // Black outline

  // Eyes
  tft.fillCircle(145, 105, 5, TFT_BLACK); // Left eye
  tft.fillCircle(175, 105, 5, TFT_BLACK); // Right eye

  // Frown
  for (int x = -20; x <= 20; x++) {
    int y = 0.05 * x * x; // Parabolic arc
    tft.drawPixel(160 + x, 140 + y, TFT_BLACK);
  }
}

// Comparison Functions
bool checkMoistureAndWarn(int soilMoisture) {
  if (soilMoisture < 40) {
    Serial.println("It's time to water your plant.");
    return true;
  } else {
    Serial.println("Your plant is not thirsty right now.");
    return false;
  }
}

bool checkLightAndWarn(int lightLevel) {
  if (lightLevel < 100) {
    Serial.println("It's too dark for your plant.");
    return true;
  } else {
    Serial.println("Light level is sufficient.");
    return false;
  }
}

bool checkTemperatureAndWarn(int temperature) {
  if (temperature < 20) {
    Serial.println("It's too cold for your plant.");
    return true;
  } else {
    Serial.println("Temperature is suitable.");
    return false;
  }
}

bool checkHumidityAndWarn(int humidity) {
  if (humidity < 30) {
    Serial.println("Humidity is too low for your plant.");
    return true;
  } else {
    Serial.println("Humidity level is good.");
    return false;
  }
}

// MQTT Callback
void callback(char *topic, byte *payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("]: ");

  String message;
  for (int i = 0; i < length; i++) {
    char c = (char)payload[i];
    Serial.print(c);
    message += c;
  }
  Serial.println();

  // Handle warning messages
  if (String(topic) == "CROWmium/alert") {
    message.trim();

    if (message == "WARNING") {
      digitalWrite(BLUE_LED, LOW);
      digitalWrite(RED_LED, HIGH);
      drawSadFace();
    } else if (message == "CLEAR") {
      digitalWrite(BLUE_LED, HIGH);
      digitalWrite(RED_LED, LOW);
      drawSmileyFace();
    }
  }
}

// MQTT Reconnect
void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("rtl8720dnClient")) {
      Serial.println("connected!");
      client.subscribe("CROWmium/alert");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" — trying again in 5 seconds");
      delay(5000);
    }
  }
}

// Setup
void setup() {
  Serial.begin(115200);
  delay(1000);

  // LCD
  tft.begin();
  tft.setRotation(3);
  drawSmileyFace();  // Default face

  // WiFi Setup
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }
  Serial.println("\nWiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  // MQTT Setup
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

  // Sensors and LEDs
  dht.begin();
  pinMode(WIO_LIGHT, INPUT);
  pinMode(SOIL_PIN, INPUT);
  pinMode(BLUE_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  digitalWrite(BLUE_LED, HIGH); // Blue LED turned on by default
  digitalWrite(RED_LED, LOW);
}

// Loop
void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long now = millis();
  const unsigned long publishInterval = 10000;
  if (now - lastMsgTime > publishInterval) {
    lastMsgTime = now;

    // Read sensor values
    int temperature = dht.readTemperature();
    int humidity = dht.readHumidity();
    int light = analogRead(WIO_LIGHT);
    int soilRaw = analogRead(SOIL_PIN);

    // Mapping soil moisture values to percentage
    int soilMoisture = map(soilRaw, 1023, 0, 0, 100);
    soilMoisture = constrain(soilMoisture, 0, 100);

    // Convert values to strings
    char tempStr[10], humStr[10], lightStr[10], soilStr[10];
    snprintf(tempStr, sizeof(tempStr), "%d", temperature);
    snprintf(humStr, sizeof(humStr), "%d", humidity);
    snprintf(lightStr, sizeof(lightStr), "%d", light);
    snprintf(soilStr, sizeof(soilStr), "%d", soilMoisture);

    // Print to Serial
    Serial.print("Temperature: "); Serial.println(tempStr);
    Serial.print("Humidity: "); Serial.println(humStr);
    Serial.print("Light: "); Serial.println(lightStr);
    Serial.print("Soil Moisture: "); Serial.println(soilStr);

    // Publish to MQTT
    client.publish("CROWmium/rtl8720dn/temperature", tempStr);
    client.publish("CROWmium/rtl8720dn/humidity", humStr);
    client.publish("CROWmium/rtl8720dn/light", lightStr);
    client.publish("CROWmium/rtl8720dn/moisture", soilStr);

    // Call comparison functions
    bool warnMoisture = checkMoistureAndWarn(soilMoisture);
    bool warnLight = checkLightAndWarn(light);
    bool warnTemp = checkTemperatureAndWarn(temperature);
    bool warnHumidity = checkHumidityAndWarn(humidity);

    bool isWarning = warnMoisture || warnLight || warnTemp || warnHumidity;

    if (isWarning) {
    digitalWrite(BLUE_LED, LOW);
    digitalWrite(RED_LED, HIGH);
    } else {
      digitalWrite(BLUE_LED, HIGH);
      digitalWrite(RED_LED, LOW);
    }
  }
}
