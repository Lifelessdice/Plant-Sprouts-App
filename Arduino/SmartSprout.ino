#include "Grove_Temperature_And_Humidity_Sensor.h"

// Sensor setup
#define DHTPIN 2
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);


void setup() {
  Serial.begin(115200);
  dht.begin();
}

void loop() {
  

    int temperature = dht.readTemperature();
    int humidity = dht.readHumidity();

    // Print to Serial
    Serial.print("Temperature: ");
    Serial.println(temperature);
    Serial.print("Humidity: ");
    Serial.println(humidity);
    delay(10000);
  
}
