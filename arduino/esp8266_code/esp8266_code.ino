#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// WiFi credentials
const char* ssid = "Dreyyyyy";
const char* password = "11111111";

// MQTT broker details
const char* mqtt_server = "test.mosquitto.org"; // Replace with your broker IP or hostname
const int mqtt_port = 1883;
const char* mqtt_topic = "mytopic/test";

// MQTT client
WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(9600); // Communication with Arduino Mega
  setupWiFi();
  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
    Serial1.begin(9600); // Use Serial1 for communication with ESP8266
    Serial1.println("Hello from Arduino");

  if (Serial.available() && client.connected()) {
  
    String sensorData = Serial.readStringUntil('\n'); // Read temperature data from arduino 
    sensorData.trim(); // Remove whitespace or newline characters

    if (sensorData.length() > 0) {
      // Publish data to the MQTT topic
      if (client.publish(mqtt_topic, sensorData.c_str())) {
        Serial.println("Data published: " + sensorData);
      } else {
        Serial.println("Failed to publish data");
      }
    }
  }
  delay(100); // Avoid tight looping
}

// Connect to WiFi
void setupWiFi() {
  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to wifi");
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
}

// Reconnect to MQTT broker
void reconnect() {
  while (!client.connected()) {
    Serial.print("Connecting to MQTT...");
    if (client.connect("ESP8266Client")) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      delay(2000);
    }
  }
}

