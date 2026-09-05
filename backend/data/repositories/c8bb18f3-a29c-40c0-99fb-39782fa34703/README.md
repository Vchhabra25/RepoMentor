LUMA – Smart Blind Stick (IoT Project)
LUMA is an IoT-based smart blind stick designed to assist visually impaired individuals through real-time obstacle detection, environmental sensing, emergency alerts, and both local and web-based monitoring.

Features
Obstacle detection using ultrasonic sensor
Water puddle detection using rain sensor
Emergency alert trigger via push button
Silent haptic feedback using vibration motor to avoid noise pollution
Buzzer alerts for critical situations
GPS-based location tracking (latitude & longitude)
Local serial monitoring for real-time debugging and instant feedback
AI-Powered Environmental Scan: Identifies ramps, stairs, and obstacles using Gemini 1.5 Flash
Cloud-based web dashboard for remote monitoring
Text-to-Speech (TTS) accessibility feedback
Sensors & Components
Ultrasonic Sensor
Rain Sensor
GPS Module (simulated coordinates for testing)
Push Button
Buzzer
Vibration Motor
Servo Motor
ESP32 Microcontroller
Tech Stack
Arduino IDE for firmware development
Embedded C / C++
ESP32 WiFi
ThingSpeak Cloud Platform
Gemini 1.5 Flash API for AI vision processing
Web Dashboard with real-time camera integration and TTS
System Overview
The ESP32 continuously reads sensor data and processes alerts locally to ensure instant response.
Critical events trigger vibration or buzzer feedback without relying on cloud connectivity.

Sensor data such as distance, rain level, button status, GPS coordinates, and alert states are:

Displayed locally via Serial Monitor for real-time monitoring
Sent periodically to ThingSpeak, where a web dashboard visualizes live sensor readings and system status
Web Dashboard
A cloud-based dashboard built using ThingSpeak enables:

Real-time visualization of sensor data
Remote monitoring of distance, rain detection, alerts, and GPS location
Historical data analysis using charts and graphs
Future Scope
Mobile application integration
Real GPS module integration
Enhanced IoT features in upcoming coursework
Extended field testing and optimization
Team
Developed by a team of 4 members as part of a university IoT research project.
