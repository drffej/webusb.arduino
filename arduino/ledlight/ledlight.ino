#include <WebUSB.h>





#include <WebUSB.h>

WebUSB WebUSBSerial(1, "localhost:8080");



#define Serial WebUSBSerial



void setup() {
  digitalWrite(LED_BUILTIN, HIGH);
  while (!Serial) {
    ;
  }
  Serial.begin(9600);
  Serial.write("Sketch begins.....\r\n> ");
  Serial.flush();
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH);
  digitalWrite(LED_BUILTIN, HIGH);
}

void loop() {
 
  if (Serial && Serial.available()) {
    int byte = Serial.read();
    Serial.write('>');
    Serial.write(byte);
    Serial.write('<');
    if (byte == 'H') {
      Serial.write("\r\nTurning LED on.");
      digitalWrite(LED_BUILTIN, HIGH);
    } else if (byte == 'L') {
      Serial.write("\r\nTurning LED off.");
      digitalWrite(LED_BUILTIN, LOW);
    }
    Serial.write("\r\n>.... ");
    Serial.flush();
  }
}

