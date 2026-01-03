# Betaflight Actual Rates Visualizer

A web-based 3D simulator designed for FPV pilots to test and tune **Betaflight Actual Rates** using a real radio transmitter via USB. This tool provides a zero-risk environment to visualize stick feel and rotation speeds before applying them to a real quadcopter, this page works similarly to the betaflight rate configuration page, allowing you to test your rates in a test environment, without flight controller heat sources. 

[**Launch the Simulator**](https://aristidesai.github.io/Betaflight-Actual-Rates-Simulator-/) | [**Video**](https://github.com/AristidesAI/Betaflight-Actual-Rates-Simulator-/blob/df0eb93fe2320d19c9b09be1c42b6bcfeea714bc/ActualRates.mp4)
Img1  | Img2
:-------------------------:|:-------------------------:
![Picture1](https://github.com/AristidesAI/Betaflight-Actual-Rates-Simulator-/blob/53126fd967b25ccbf7257757a515e9248be75a61/Screenshot%202026-01-03%20155640.png) | ![Picture2](https://github.com/AristidesAI/Betaflight-Actual-Rates-Simulator-/blob/53126fd967b25ccbf7257757a515e9248be75a61/Screenshot%202026-01-03%20155704.png) 






## Features

* **Real-time 3D Simulation**: High-performance rendering of a 5-inch FPV drone that reacts instantly to your radio sticks.
* **Universal Controller Support**: Compatible with any HID-compliant device (Radiomaster Pocket/Zorro/TX16S, TBS Mambo/Tango 2, Jumper, etc.).
* **Custom Axis Mapping**: A built-in configuration utility to map Roll, Pitch, Yaw, and Throttle to any axis, ensuring compatibility across Windows, macOS, and Linux.
* **Actual Rates Math**: Accurately simulates the Betaflight "Actual" rate model, including **Center Sensitivity**, **Max Rate**, and **Expo**.
* **Floating Throttle Physics**: The drone model adjusts altitude based on your throttle stick position for a more immersive feel.
* **Persistent Settings**: Your rate profiles and controller mappings are saved to your browser's local storage automatically.

## User Documentation

### 1. Connecting the Hardware
1.  Turn on your Radio Transmitter/FPV Controller, any will work and the site has been customized to allow for multiple controller modes:
![https://drones.stackexchange.com/questions/186/what-are-modes-of-a-transmitter-controller]
2.  Ensure your model is set to **USB Joystick** or **HID Mode**.
3.  Connect the radio to your PC via a USB-C cable.
4.  Open the [Visualizer](https://aristidesai.github.io/Betaflight-Actual-Rates-Simulator-/).
5.  A **Floating Notification** will appear in the top-right corner once the browser detects the device.

### 2. Configuring Your Controller
Since different operating systems and radios map axes differently, you must map your sticks:

1.  Click the **🎮 Configure Controller** button.
2.  Wiggle your sticks. You will see blue bars moving next to "Axis 0", "Axis 1", etc.
3.  Assign the moving axis number to the corresponding flight function (Roll, Pitch, Yaw, Throttle).
4.  Use the **Inv** (Invert) checkbox if a stick direction is reversed.
5.  Click **Save & Close**.

### 3. Understanding the Rates
The sidebar allows you to input your Betaflight values:

| Setting | Description |
| :--- | :--- |
| **Center Sensitivity** | The "feel" around the center of the stick. Higher = more twitchy. |
| **Max Rate** | The maximum rotation speed in degrees per second at full deflection. |
| **Expo** | Adds a curve to the stick. Higher values make the center softer while keeping the max rate high. |

## Tech Stack

- **Graphics**: [Three.js](https://threejs.org/) (WebGL)
- **Input**: HTML5 Gamepad API
- **UI/UX**: Material Design CSS with Light/Dark mode support
- **Logic**: Vanilla JavaScript (ES6+)

##  Acknowledgments

- **Betaflight Team**: For the mathematical models used in modern FPV flight.
- **Three.js Community**: For the robust 3D engine documentation.


**Created by [AristidesAI](https://github.com/AristidesAI)** [@aristides.fpv on instagram](https://www.instagram.com/aristides.fpv/)
