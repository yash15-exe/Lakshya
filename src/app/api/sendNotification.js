import admin from "firebase-admin";
import { NextResponse } from "next/server";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = require("../../../bytecamp-database-153f24d9f366.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export async function POST(req) {
  try {
    const { tokens, title, body } = await req.json(); // Receive notification data

    const message = {
      notification: { title, body },
      tokens, // Send to multiple devices
    };

    const response = await admin.messaging().sendMulticast(message);
    return NextResponse.json({ success: true, response });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
