"use client";
import { useState, useRef, useEffect } from "react";
import jsQR from "jsqr";
import { useRouter } from "next/navigation";
import { Scan, Check } from "lucide-react";
import { db } from "@/app/lib/firebaseConfig"; // Import Firebase configuration
import { ref, get } from "firebase/database"; // Realtime Database functions
import { v4 as uuid } from "uuid";

export default function QRScanner() {
  const [scanning, setScanning] = useState(false);
  const [hid, setHid] = useState(null);
  const [message, setMessage] = useState("");
  const [fcmToken, setFcmToken] = useState(null);
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    console.log(otp); // Example output: 4729

    setOtp(`${otp}`)
    if (scanning) {
      startCamera();
      startScanningLoop();
    } else {
      stopCamera();
      stopScanningLoop();
    }
    return () => {
      stopCamera();
      stopScanningLoop();
    };
  }, [scanning]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setMessage("Camera access denied. Please allow camera permissions.");
    }
  };

  const stopCamera = () => {
    videoRef.current?.srcObject &&
      (videoRef.current.srcObject)
        .getTracks()
        .forEach((track) => track.stop());
  };

  const startScanningLoop = () => {
    scanIntervalRef.current = setInterval(scanQRCode, 500);
  };

  const stopScanningLoop = () => {
    scanIntervalRef.current && clearInterval(scanIntervalRef.current);
  };

  const scanQRCode = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height, {
      inversionAttempts: "dontInvert",
    });

    if (code) {
      const scannedData = code.data.trim();
      console.log("Raw QR Data:", scannedData);

      if (scannedData) {
        setHid(scannedData);
        setMessage("QR Code Scanned Successfully!");
        setScanning(false); // Stop scanning after successful detection
        fetchFcmToken(scannedData); // Fetch FCM token for the scanned HID
      } else {
        setMessage("Invalid QR Code. Please scan again.");
      }
    }
  };

  const fetchFcmToken = async (hid) => {
    try {
      const fcmTokenRef = ref(db, `user/${hid}/fcm`);
      const snapshot = await get(fcmTokenRef);
      if (snapshot.exists()) {
        setFcmToken(snapshot.val());
        await fetch('/api/sendNotification',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tokens: [snapshot.val()],
            title: 'HealthBot',
            body: `Your OTP is ${otp}`,
           }),
        })
        setShowOtpField(true); // Show OTP field after fetching FCM token
      } else {
        setMessage("No FCM token found for this HID.");
      }
    } catch (error) {
      console.error("Error fetching FCM token:", error);
      setMessage("Failed to fetch FCM token. Please try again.");
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp) {
      setMessage("Please enter the OTP.");
      return;
    }

    // Simulate OTP verification (replace with actual API call)
    const isValidOtp = await verifyOtp(otp); // Replace with your OTP verification logic
    if (isValidOtp) {
      setMessage("OTP verified successfully!");
      router.push(`/doctor/user/${hid}`); // Navigate to the desired route
    } else {
      setMessage("Invalid OTP. Please try again.");
    }
  };

  const verifyOtp = async (otpVerify) => {
    // Replace this with your actual OTP verification logic
    // For example, send the OTP to your backend API for verification
    return otpVerify === otp; // Dummy OTP verification
  };

  return (
    <div className="bg-blue-400 min-h-screen w-full">
      <div className="container mx-auto p-6 flex flex-col justify-center items-center min-h-screen">
        <h1 className="text-white font-bold text-2xl mb-8">SCAN USER</h1>

        <div className="w-full max-w-md aspect-square rounded-xl overflow-hidden relative mb-8 shadow-lg bg-blue-700 p-4">
          {scanning ? (
            <div className="w-full h-full rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full rounded-lg object-cover"
              ></video>
              <canvas ref={canvasRef} className="hidden"></canvas>

              {/* Scanning overlay with frame */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-white/80 rounded-lg flex items-center justify-center">
                  <div className="w-56 h-56 border border-blue-300/70 rounded-md relative">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-300 rounded-tl-sm"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-300 rounded-tr-sm"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-300 rounded-bl-sm"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-300 rounded-br-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-blue-800 rounded-lg">
              <div className="bg-blue-700 p-4 rounded-full mb-4">
                <Scan size={64} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">QR Scanner</h3>
              <p className="text-blue-100 text-center mb-6">
                Scan a patient's QR code to quickly access their medical information
              </p>
            </div>
          )}
        </div>

        {!showOtpField ? (
          <button
            onClick={() => {
              setScanning(!scanning);
              setMessage("");
              setHid(null);
            }}
            className="bg-blue-500 text-white py-3 px-8 rounded-md hover:bg-blue-800 transition duration-300 ease-in-out mb-4 font-medium flex items-center justify-center shadow-md"
          >
            <Scan size={18} className="mr-2" />
            {scanning ? "Stop Scanning" : "Start Scanning"}
          </button>
        ) : (
          <div className="w-full max-w-md bg-blue-500 p-6 rounded-lg shadow-lg">
            <h3 className="text-white font-medium mb-4 text-center">Enter the OTP sent to patient</h3>
            <input
              type="text"
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
            />
            <button
              onClick={handleOtpSubmit}
              className="bg-blue-800 text-white py-3 px-6 rounded-md hover:bg-blue-900 transition duration-300 ease-in-out w-full font-medium flex items-center justify-center shadow-md"
            >
              <Check size={18} className="mr-2" />
              Verify OTP
            </button>
          </div>
        )}

        {message && (
          <div
            className={`text-center py-2 px-4 rounded-md mt-4 w-full max-w-md shadow-sm ${
              message.includes("denied") || message.includes("Invalid")
                ? "bg-red-500"
                : "bg-emerald-500"
            } text-white`}
          >
            {message}
          </div>
        )}

        {hid && !showOtpField && (
          <div className="mt-6 text-center p-4 bg-blue-500 border border-blue-500 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold text-white">Scanned HID</h2>
            <p className="mt-2 text-white font-mono bg-blue-300 p-2 rounded border border-blue-600">{hid}</p>
          </div>
        )}
      </div>
    </div>
  );
}