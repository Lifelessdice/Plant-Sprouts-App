#include "rpcWiFi.h"
#include <PubSubClient.h>
#include "Grove_Temperature_And_Humidity_Sensor.h"

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

// Timing
unsigned long lastMsgTime = 0;

// Soil moisture comparison logic
void checkMoistureAndWarn(int soilMoisture) {
  if (soilMoisture < 40) {
    Serial.println("It's time to water your plant.");
  } else {
    Serial.println("Your plant is not thirsty right now.");
  }
}

// Light level comparison logic
void checkLightAndWarn(int lightLevel) {
  if (lightLevel < 100) {
    Serial.println("It's too dark for your plant.");
  } else {
    Serial.println("Light level is sufficient.");
  }
}

// Temperature comparison logic
void checkTemperatureAndWarn(int temperature) {
  if (temperature < 20) {
    Serial.println("It's too cold for your plant.");
  } else {
    Serial.println("Temperature is suitable.");
  }
}

void checkHumidityAndWarn(int humidity) {
  if (humidity < 30) {
    Serial.println("Humidity is too low for your plant.");
  } else {
    Serial.println("Humidity level is good.");
  }
}

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
  if (String(topic) == "CROWmium/rtl8720dn/warnings") {
    message.trim();

    if (message == "WARNING") {
      digitalWrite(BLUE_LED, LOW);
      digitalWrite(RED_LED, HIGH);
    } else if (message == "CLEAR") {
      digitalWrite(BLUE_LED, HIGH);
      digitalWrite(RED_LED, LOW);
    }
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("rtl8720dnClient")) {
      Serial.println("connected!");
      client.subscribe("CROWmium/rtl8720dn/#");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" — trying again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  delay(1000);

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
    checkMoistureAndWarn(soilMoisture);
    checkLightAndWarn(light);
    checkTemperatureAndWarn(temperature);
    checkHumidityAndWarn(humidity);
  }
}
