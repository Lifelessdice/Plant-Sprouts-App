![SmartSprout Logo](https://git.chalmers.se/courses/dit113/2025/group-20/system-development/-/wikis/uploads/9d4712268f39c2db550dcad2bb3a2139/logo.png)



SmartSprout is an innovative smart plant monitoring system designed to help users keep their plants healthy effortlessly. It consists of two main components: a sensor device equipped with sensors to measure temperature, humidity, light, and soil moisture, and a mobile application that displays real-time data and alerts users when their plants need attention.

You can check out this video summary that highlights the motivation behind the project, the system’s key features, and a quick walkthrough of the mobile app interface.

SmartSrpout is a great project for anyone interested in learning about Wio terminals, sensor integration, MQTT connectivity, real-time data visualization, and mobile app development.

The mobile app is built using React Native and Expo, providing a dynamic user experience with modern UI components. The app is supported by the backend server, which is developed using Express.js, which handles API requests and manages communication with Firebase Firestore. Together, the frontend and backend create our application that allows users to monitor the plant’s health seamlessly.

Connectivity between the sensor device and the application is enabled through MQTT messaging, using the public HiveMQ as the broker, which implements the publish-subscribe communication pattern for efficient and scalable data transmission.

To securely store user data and plant information, the system uses Firebase Firestore, allowing user authentication, real-time synchronization, and data management.

For project automation and dependency management, we use the internal Expo builder for an automated build and maintain a CI/CD pipeline to ensure reliable builds and deployments.

## Getting Started
### Installation
- Download and install the [Arduino IDE](https://www.arduino.cc/en/software) to flash code to the microcontroller.
- Your IDE of choice for React Native(we recommend [VSCode](https://code.visualstudio.com/)).
- Download and install [Node.js](https://nodejs.org/en) which comes bundled with `npm`.
 
- Expo CLI(global install)
  Run the following command once to installl Expo CLI globally:

    ```bash
    npm install -g expo-cli
    ```
- Install Project Dependencies,
  From the root directory:

    ```bash
    npm install
    ```

### Running the App
- You can start the app in development mode by running the following from the project root directory:

    ```bash
    npm start
    ```
  The app can be run on a physical mobile device using the [Expo Go](https://expo.dev/go) app as long as it and the computer are on the same network or an IDE which has an integrated emulator like [Android Studio](https://developer.android.com/studio).

  Alternatively, as a user, you can simply download the [APK file](https://expo.dev/artifacts/eas/ppdvYRdy7mZx4NdxtPQ8xh.apk), install it on your Android device, and start using the app immediately.


### Libraries

### Wio Terminal & Sensors

## System Design 
The **SmartSprout** mobile app uses **Firebase Firestore** to store plant-specific metadata and user authentication. Firestore is a scalable, cloud-hosted NoSQL datbase that updated in real time across all devices.

---

The system is composed of the following core components:
- A **React Native** frontend built with **Expo**
- A **Node.js + Express** backend
- A **Firebase Firestore** cloud database
- MQTT integration via **HiveMQ** for real-time communication with IoT devices

The frontend and backend together form the complete application. The frontend handles all user interactions, while the backend manages data processing and serves as the bridge between Firebase, MQTT, and the app.




