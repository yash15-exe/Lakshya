"use client";
import { useState, useRef, useEffect } from "react";
import jsQR from "jsqr";
import { useRouter } from "next/navigation";
import { Scan } from "lucide-react";

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
            
            {/* <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm bg-black/50 py-1">
              Position QR code within the frame
            </div> */}
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

      {message && (
        <div
          className={`text-center py-2 px-4 rounded-md mt-4 w-full max-w-md shadow-sm ${
            message.includes("denied") ? "bg-red-500" : "bg-emerald-500"
          } text-white`}
        >
          {message}
        </div>
      )}

      {hid && (
        <div className="mt-6 text-center p-4 bg-white border border-purple-200 rounded-lg w-full max-w-md shadow-sm">
          <h2 className="text-lg font-semibold text-purple-700">Scanned HID</h2>
          <p className="mt-2 text-purple-800 font-mono bg-purple-50 p-2 rounded border border-purple-100">{hid}</p>
        </div>
      )}
    </div>
  );
}
