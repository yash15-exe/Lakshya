import { messaging } from "./firebaseConfig";
import { getToken, onMessage } from "firebase/messaging";

// Request permission and get FCM token
export const requestForToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "YOUR_VAPID_KEY", // Replace with your VAPID key
      });
      console.log("FCM Token:", token);
      return token;
    } else {
      console.error("Notification permission denied.");
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
  }
};

// Send push notification
export const sendPushNotification = async (outbreakName) => {
  const token = await requestForToken();
  if (!token) {
    console.error("No FCM token available.");
    return;
  }

  const message = {
    notification: {
      title: "Outbreak Alert",
      body: `Alert for ${outbreakName}! Take necessary precautions.`,
    },
    token,
  };

  // Send the message using Firebase Cloud Messaging
  fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `key=YOUR_SERVER_KEY`, // Replace with your FCM Server Key
    },
    body: JSON.stringify(message),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Push notification sent:", data);
    })
    .catch((error) => {
      console.error("Error sending push notification:", error);
    });
};