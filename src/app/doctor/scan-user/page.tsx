"use client";
import { useState, useRef, useEffect } from "react";
import jsQR from "jsqr";
import { db } from "@/app/lib/firebaseConfig";
import { useRouter } from "next/navigation";

export default function QRScanner() {
  const [scanning, setScanning] = useState(false);
  const [hid, setHid] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  useEffect(() => {
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
        router.push(`/doctor/user/${scannedData}`);
        setScanning(false); // Stop scanning after successful detection
      } else {
        setMessage("Invalid QR Code. Please scan again.");
      }
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg max-w-2xl h-screen flex flex-col justify-center items-center">
      <h1 className="text-black font-bold text-2xl">SCAN USER</h1>

      {scanning && (
        <div className="relative mb-4">
          <video
            ref={videoRef}
            className="w-full h-72 rounded-lg border-2 border-gray-300"
            style={{ objectFit: "cover" }}
          ></video>
          <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
      )}

      <h1 className="text-xl font-semibold text-center text-gray-800 mb-6">
        Scan QR Code
      </h1>

      <button
        onClick={() => {
          setScanning(!scanning);
          setMessage("");
          setHid(null);
        }}
        className="bg-gray-950 text-white py-2 px-4 rounded-md hover:bg-gray-900 transition duration-300 ease-in-out mb-4"
      >
        {scanning ? "Stop Scanning" : "Start Scanning"}
      </button>

      {message && (
        <div
          className={`text-center py-2 px-4 rounded-md mt-4 ${
            message.includes("Error") ? "bg-red-500" : "bg-green-500"
          } text-white`}
        >
          {message}
        </div>
      )}

      {hid && (
        <div className="mt-6 text-center">
          <h2 className="text-lg font-semibold text-gray-700">Scanned HID</h2>
          <p className="mt-2 text-gray-700">{hid}</p>
        </div>
      )}
    </div>
  );
}
