Email OTP Authentication System with Firebase and Express
This repository contains a simple and secure email OTP (One-Time Password) authentication system built with Firebase, Express, and Node.js. The system allows users to sign up by verifying their email address using a one-time password sent via email. Additionally, it provides a login functionality using Firebase Authentication.

Features:
Email Verification: Users receive a one-time password via email for email address verification during sign up.
Firebase Authentication: Utilizes Firebase Authentication for secure user login.
Express Server: Implements an Express.js server for handling authentication requests.
Firestore Database: Uses Firestore, Firebase's NoSQL database, to store user OTP details.
Project Structure:
public: Contains HTML files for user interaction.
service_account.json: Firebase service account credentials for server authentication.
firebase-config.js: Firebase configuration file.
index.js: Express server setup and OTP verification logic.
Getting Started:
Clone the repository: git clone https://github.com/your-username/otp-authentication.git
Install dependencies: npm install
Set up Firebase: Replace service_account.json and update firebase-config.js with your Firebase credentials.
Run the server: npm start
Access the application at http://localhost:3000
Feel free to explore and integrate this authentication system into your projects. Contributions and feedback are welcome!
