WebUSB -️ Arduino Experiment
===========================

This repository is an example implementation of WebUSB communicating with Arduino devices.  It contains the Javascript and HTML code, plus the Arduino sketch and WebUSB library.

The code has been taken and modified from https://github.com/webusb/arduino. 

The demo shows:

1. Pairing and connecting to Arduino devices from Chrome
2. Sending data to and from the device from Chrome, which turns on the System LED
3. Reconnecting on Browser refresh (if paired)
4. Disconnecting and reconnecting if the device is unplugged from the USB port

This works on Windows 10 hardware and will update when I have tested this on the Mac.

Compatible Hardware
-------------------

WebUSB library for Arduino requires an hardware model that gives the sketch complete control over the USB hardware. The library has been tested with the following models:

 * Arduino Leonardo
 * Arduino/Genuino Micro (which is what I have used)

These boards are both based on the ATmega32U4.

Getting Started
---------------

There three parts to getting this work - 

A. Setting up Chrome for WebUSB.
B. Installing Arduino WebUSB library and compiling the Sketch
C. Accessing the demo HTML and Javascript

A. Setting Chrome for WebUSB
----------------------------

The implementation is available via the "Experimental Web Platform Features" flag.  

1. Navigate to chrome://flags
2. Enable the flag called '#enable-experimental-web-platform-features'
3. Close and restart the browser

You may also want to check out  chrome://device-log where you can see all USB device related events in case of issues.

B.Installing Arduino WebUSB library
-----------------------------------

1. Install at least version 1.6.11 of the [Arduino IDE](https://www.arduino.cc/en/Main/Software).

2. The WebUSB library provides all the extra low-level USB code necessary for WebUSB support except for one thing: Your device must be upgraded from USB 2.0 to USB 2.1. To do this go into the SDK installation directory and open `hardware/arduino/avr/cores/arduino/USBCore.h`. Then find the line `#define USB_VERSION 0x200` and change `0x200` to `0x210`. That's it!

  **macOS:** Right click on the Ardunio application icon and then click on show package contents menu item. Navigate to `Contents/Java/hardware/arduino/avr/cores/arduino/USBCore.h`
  
  **Warning:** Windows requires USB 2.1 devices to present a Binary Object Store (BOS) descriptor when they are enumerated. The code to support this is added by including the "WebUSB" library in your sketch. If you do not include this library after making this change to the SDK then Windows will no longer be able to recognize your device and you will not be able to upload new sketches to it.

4. Copy (or symlink) the `arduino/library/WebUSB` directory from this repository into the `libraries` folder in your sketchbooks directory.

5. Launch the Arduino IDE. You should see "WebUSB" as an option under "Sketch > Include Library".

6. Load up `arduino/ledlight/ledlight.ino` and program it to your device.

C. Access the Demo
------------------

1. Start the browser with security features disabled - e.g. "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --disable-webusb-security
2. Plug the device into your PC/Mac and open the browser to https://drffej.github.io/webusb.arduino/
3. Click on 'Connect' to pair the device
4. Click on Toggle to turn on/off the Led


Alternately you can run this locally via

$ python -m http.server

or any other webserver and this does not need the security features disabling!

JP 24/08/2017