#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <BME280I2C.h>
#include <BH1750.h>
#include <NTPClient.h>
#include <WiFiUdp.h>

#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#include "arduino_secrets.h"
#include "ThingSpeak.h" // always include thingspeak header file after other header files and custom macros

#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels
#define OLED_RESET     LED_BUILTIN // OLED reset pin # (or -1 if sharing Arduino reset pin)
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET); // OLED setup

BME280I2C bme;
BH1750 lightMeter;

char ssid[] = SECRET_SSID;   // your network SSID (name) 
char pass[] = SECRET_PASS;   // your network password
WiFiClient  client;

unsigned long myChannelNumber = SECRET_CH_ID;
const char * myWriteAPIKey = SECRET_WRITE_APIKEY;

// Initialize our values
int number1 = 0;
int number2 = 0;
int statuscode = 0;
String myStatus = "";
float tmp = 0;
float hmd = 0;
float lux = 0;
int buttonPin = 10;  
int buttonState = 0;
static unsigned long lastTime = 0;

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 0 ,60000);

void setup() {
 
  // Start basics
  pinMode(buttonPin, INPUT_PULLUP);
  Serial.begin(115200);
  Wire.begin();

  while(!bme.begin()) {
    Serial.println("Could not find BME280 sensor!");
    delay(1000);
  }
  while(!lightMeter.begin()) {
    Serial.println("Could not find GY-302 sensor!");
    delay(1000);    
  }
  ThingSpeak.begin(client);
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  timeClient.begin();

  // Start display
  display.clearDisplay();
  display.setCursor(0,0);
  display.setTextSize(2);
  display.setTextColor(WHITE);
  display.println("Konichiwa!");
  display.display();

  Serial.println("Setup completed.");
  delay(5000);
  display.clearDisplay();
  display.setCursor(0,0);
  display.println("Starting..");
  display.display();

  // Start Wifi
  while(WiFi.status() != WL_CONNECTED){
    WiFi.begin(ssid, pass);  // Connect to WPA/WPA2 network. Change this line if using open or WEP network
    Serial.print(".");
    delay(5000);     
  }

  // Get time
  timeClient.update();
  Serial.print("Current time is.. ");
  Serial.println(timeClient.getFormattedTime());
  Serial.println("Aligning clocks..");

  // Align clocks  
  while(timeClient.getMinutes() % 5 != 0) {
    Serial.print("..");
    delay(5000); 
  }
  Serial.println(timeClient.getFormattedTime());
  lastTime = (millis() - (timeClient.getSeconds() * 1000) + 2000);
  Serial.println("Done");
  timeClient.end();
  display.clearDisplay();
  display.display();
}

void loop() {

  buttonState = digitalRead(buttonPin);
  if (buttonState == LOW) {

    // Get values from sensors
    tmp = bme.temp();
    hmd = bme.hum();
    lux = lightMeter.readLightLevel();
    
    display.clearDisplay();
    display.setCursor(0,0);
    display.println("Now:");
    display.print(tmp);
    display.print(char(167));
    display.println("C");
    display.print(hmd);
    display.println("%H");
    display.print(lux);
    display.println("Lx");
    display.display();
    delay(5000);
    display.clearDisplay();
    display.display();
  }

  // Reconnect to Wifi if needed
  if(WiFi.status() != WL_CONNECTED){
    
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(SECRET_SSID);
    while(WiFi.status() != WL_CONNECTED){
      WiFi.begin(ssid, pass);
      Serial.print(".");
      delay(5000);     
    }
    Serial.println("\nWifi connected.");
  }

  // Wake up every 5 minutes
  if (millis() - lastTime >= 300000ul) {

    lastTime = millis();

    // Set values from sensors
    tmp = bme.temp();
    hmd = bme.hum();
    lux = lightMeter.readLightLevel();

    // Set Thingspeak fields
    ThingSpeak.setField(1, tmp);
    ThingSpeak.setField(2, hmd);
    ThingSpeak.setField(3, lux);
    
    // Set Thingspeak status
    ThingSpeak.setStatus(myStatus);
    
    // Write to ThingSpeak channel
    statuscode = ThingSpeak.writeFields(myChannelNumber, myWriteAPIKey);
  
    // Log result
    if(statuscode == 200){
        Serial.println("Channel update successful.");
    }
    else{
        Serial.println("Problem updating channel. HTTP error code " + String(statuscode));
        display.clearDisplay();
        display.setCursor(0,0);
        display.print("Error ");
        display.println(statuscode);
        display.display();
    }
   } 
    
}
