import { db } from "@/lib/firebaseConfig.js";
import { ref, get, child } from "firebase/database";

export const fetchFCMTokens = async () => {
  const dbRef = ref(db);
  try {
    const snapshot = await get(child(dbRef, "users")); // Fetch all users
    if (snapshot.exists()) {
      let tokens = [];
      snapshot.forEach((user) => {
        if (user.val().fcmToken) {
          tokens.push(user.val().fcmToken);
        }
      });
      return tokens; // Return an array of tokens
    } else {
      console.log("No data found");
      return [];
    }
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return [];
  }
};
