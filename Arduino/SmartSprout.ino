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
DHT dht(DHTPIN, DHTTYPE);

// MQTT client setup
WiFiClient wifiClient;
PubSubClient client(wifiClient);

// Timing
unsigned long lastMsgTime = 0;

void callback(char *topic, byte *payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("]: ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("rtl8720dnClient")) {
      Serial.println("connected!");
      client.subscribe("CROWmium/rtl8720dn/#"); // Optionally subscirbing to every topic
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

  // WiFi
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }
  Serial.println("\nWiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  // MQTT
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

  // Sensors
  dht.begin();
  pinMode(WIO_LIGHT, INPUT);
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

    int temperature = dht.readTemperature();
    int humidity = dht.readHumidity();
    int light = analogRead(WIO_LIGHT);

    char tempStr[10], humStr[10], lightStr[10];
    snprintf(tempStr, sizeof(tempStr), "%d", temperature);
    snprintf(humStr, sizeof(humStr), "%d", humidity);
    snprintf(lightStr, sizeof(lightStr), "%d", light);

    // Print to Serial
    Serial.print("Temperature: ");
    Serial.println(tempStr);
    Serial.print("Humidity: ");
    Serial.println(humStr);
    Serial.print("Light: ");
    Serial.println(lightStr);

    // Publish to separate topics
    client.publish("CROWmium/rtl8720dn/temperature", tempStr);
    client.publish("CROWmium/rtl8720dn/humidity", humStr);
    client.publish("CROWmium/rtl8720dn/light", lightStr);
  }
}
