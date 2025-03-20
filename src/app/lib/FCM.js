const { google } = require("google-auth-library");
const fs = require("fs");

// Path to your service account key file
const SERVICE_ACCOUNT_KEY_PATH = "@/bytecamp-database-153f24d9f366.json"

// Function to generate an access token
const generateAccessToken = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_KEY_PATH,
    scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
  });

  const accessToken = await auth.getAccessToken();
  return accessToken;
};

// Example usage
generateAccessToken()
  .then((token) => {
    console.log("Access Token:", token);
  })
  .catch((error) => {
    console.error("Error generating access token:", error);
  });