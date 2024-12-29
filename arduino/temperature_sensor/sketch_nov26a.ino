
//Include libraries
#include <OneWire.h>
#include <DallasTemperature.h>

// Data wire is plugged into pin 2 on the Arduino
#define ONE_WIRE_BUS 7

// Setup a oneWire instance to communicate with any OneWire devices (not just Maxim/Dallas temperature ICs)
OneWire oneWire(ONE_WIRE_BUS);
// Pass our oneWire reference to Dallas Temperature. 
DallasTemperature sensors(&oneWire);
bool sensorsActive = true;

void setup(void)
{
  Serial1.begin(9600); //Begin serial communication
  sensors.begin();
}

void loop(void) 
{ 
  // Send the command to get temperatures
  if (sensorsActive){ 
      sensors.requestTemperatures();  
      Serial1.println(sensors.getTempCByIndex(0)); //send to ESP8266 Node mcu via serial
  }

   // Check if there's a command from the serial
  if (Serial.available() > 0) {
    String command = Serial.readString(); // Read the command
    command.trim(); // Clean up the command

    if (command == "TURN_OFF") {
      sensorsActive = false; // Turn off all sensors
      Serial.println("Sensors turned off");
    } else if (command == "TURN_ON") {
      sensorsActive = true; // Turn on all sensors
      Serial.println("Sensors turned on");
    }
  }
  delay(1000);
}
