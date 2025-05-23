![SmartSprout Logo](https://git.chalmers.se/courses/dit113/2025/group-20/system-development/-/wikis/uploads/9d4712268f39c2db550dcad2bb3a2139/logo.png)



SmartSprout is an innovative smart plant monitoring system designed to help users keep their plants healthy effortlessly. It consists of two main components: a sensor device equipped with sensors to measure temperature, humidity, light, and soil moisture, and a mobile application that displays real-time data and alerts users when their plants need attention.

You can check out this video summary that highlights the motivation behind the project, the system’s key features, and a quick walkthrough of the mobile app interface.

SmartSrpout is a great project for anyone interested in learning about Wio terminals, sensor integration, MQTT connectivity, real-time data visualization, and mobile app development.

The mobile app is built using React Native and Expo, providing a dynamic user experience with modern UI components. The app is supported by the backend server, which is developed using Express.js, which handles API requests and manages communication with Firebase Firestore. Together, the frontend and backend create our application that allows users to monitor the plant’s health seamlessly.

Connectivity between the sensor device and the application is enabled through MQTT messaging, using the public HiveMQ as the broker, which implements the publish-subscribe communication pattern for efficient and scalable data transmission.

To securely store user data and plant information, the system uses Firebase Firestore, allowing user authentication, real-time synchronization, and data management.

For project automation and dependency management, we use the internal Expo builder for an automated build and maintain a CI/CD pipeline to ensure reliable builds and deployments.

