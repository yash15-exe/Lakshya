import admin from "firebase-admin";
import { NextResponse } from "next/server";

// Initialize Firebase Admin SDK (if not already initialized)
if (!admin.apps.length) {
  const serviceAccount = require("../../../../bytecamp-database-153f24d9f366.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export async function POST(req) {
  try {
    const { tokens, title, body } = await req.json(); // Receive notification data

    if (!tokens || tokens.length === 0) {
      return NextResponse.json({ success: false, error: "No tokens provided" });
    }

    const message = {
        tokens,
        notification: { 
          title, 
          body 
        },
        data: {
          customData: "Your Custom Data"
        },
        android: {
    priority: "high",
    ttl:"0s"
  },
  apns: {
    headers: {
      "apns-priority": "10"
    }
  }
      };
      
    // Instead of sendMulticast(), use sendEachForMulticast()
    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      notification: message.notification,
    });

    return NextResponse.json({ success: true, response });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
1