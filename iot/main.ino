#include <WiFi.h>
#include <HTTPClient.h>


const char* ssid = "";
const char* password = "";

const char* serverUrl = "";

void setup() {
  Serial.begin(115200);

 
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnected to Wi-Fi");
}

void loop() {
  // Simulated water pressure values
  int end1Pressure = random(20, 150);  // Replace with actual sensor readings
  int end2Pressure = random(20, 150);  // Replace with actual sensor readings

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    // Create JSON payload
    String payload = String("{\"end1Pressure\":") + end1Pressure + 
                     String(",\"end2Pressure\":") + end2Pressure + "}";

    // Send POST request
    int httpResponseCode = http.POST(payload);
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Response: " + response);
    } else {
      Serial.println("Error on sending POST: " + String(httpResponseCode));
    }
    http.end();
  } else {
    Serial.println("Wi-Fi disconnected");
  }

  delay(10000); // Send data every 10 seconds
}
