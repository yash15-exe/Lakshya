export const sendNotification = async (title, bodyText) => {
    // const tokens = await fetchFCMTokens(); // Fetch tokens from Realtime Database
    const tokens = ["f3Y_N5l6TdO7A3B0jJ9JbG:APA91bFTceiiunnkWQx_j081rSxAdTpQZFNvV8CqlQig91EeB6hnRHWjKeD276TkD3HN82ocBlhzGo6v3_HCM7kbv2I1CBNNFyzYf3C_R2GX71ZumooxG4c","fmOUUiF3SZ6PjM4-SEuyq9:APA91bGQi8-ShV2WTOWU_JADQJmN6YU3DAk0Bx55xXsoDI7OM7zULELjE9Ya5JJ3sor_k-FdgeR3pU8N1ptcCGQNrTdCZecMYESNbAQA-M3TuaAQtkNFt74"]
    if (tokens.length === 0) {
      console.log("No tokens found.");
      return;
    }
  
    const response = await fetch("/api/sendNotification", {
      method: "POST",
      body: JSON.stringify({
        tokens: tokens, // Send retrieved FCM tokens
        title,
        body: bodyText,
      }),
      headers: { "Content-Type": "application/json" },
    });
  0
    const result = await response.json();
    console.log(result);
  };