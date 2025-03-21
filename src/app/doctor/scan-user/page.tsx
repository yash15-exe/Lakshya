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
  const [hid, setHid] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
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
      (videoRef.current.srcObject as MediaStream)
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

  const fetchFcmToken = async (hid: string) => {
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

  const verifyOtp = async (otpVerify: string) => {
    // Replace this with your actual OTP verification logic
    // For example, send the OTP to your backend API for verification
    return otpVerify === otp; // Dummy OTP verification
  };

  return (
    <div className="container mx-auto p-6 bg-gradient-to-b from-purple-50 to-purple-200 shadow-lg rounded-lg max-w-2xl min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-purple-900 font-bold text-2xl mb-8">SCAN USER</h1>

      <div className="w-full max-w-md aspect-square rounded-xl overflow-hidden relative mb-8 shadow-md">
        {scanning ? (
          <>
            <video
              ref={videoRef}
              className="w-full h-full rounded-lg object-cover"
            ></video>
            <canvas ref={canvasRef} className="hidden"></canvas>

            {/* Scanning overlay with frame */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-white/80 rounded-lg flex items-center justify-center">
                <div className="w-56 h-56 border border-purple-500/70 rounded-md relative">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-500 rounded-tl-sm"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-500 rounded-tr-sm"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-purple-500 rounded-bl-sm"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-500 rounded-br-sm"></div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-white rounded-xl">
            <Scan size={64} className="text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-purple-800">QR Scanner</h3>
            <p className="text-purple-600 text-center mb-6">
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
          className="bg-purple-600 text-white py-3 px-6 rounded-md hover:bg-purple-700 transition duration-300 ease-in-out mb-4 font-medium flex items-center justify-center shadow-md"
        >
          <Scan size={18} className="mr-2" />
          {scanning ? "Stop Scanning" : "Start Scanning"}
        </button>
      ) : (
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="Enter OTP"
            
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 border border-purple-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleOtpSubmit}
            className="bg-purple-600 text-white py-3 px-6 rounded-md hover:bg-purple-700 transition duration-300 ease-in-out w-full font-medium flex items-center justify-center shadow-md"
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
        <div className="mt-6 text-center p-4 bg-white border border-purple-200 rounded-lg w-full max-w-md shadow-sm">
          <h2 className="text-lg font-semibold text-purple-700">Scanned HID</h2>
          <p className="mt-2 text-purple-800 font-mono bg-purple-50 p-2 rounded border border-purple-100">{hid}</p>
        </div>
      )}
    </div>
  );
}