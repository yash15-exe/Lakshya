"use client";
import { useState, useRef, useEffect } from "react";
import jsQR from "jsqr";
import { useRouter } from "next/navigation";
import { Scan, User, AlertCircle } from "lucide-react";

export default function DoctorQRScanner() {
  const [scanning, setScanning] = useState(false);
  const [hid, setHid] = useState(null);
  const [message, setMessage] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const scanIntervalRef = useRef(null);
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
        setMessage("Patient ID scanned successfully!");
        router.push(`/doctor/user/${scannedData}`);
        setScanning(false); // Stop scanning after successful detection
      } else {
        setMessage("Invalid QR Code. Please scan again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-blue-700 flex flex-col items-center justify-center p-4">
      {/* Top header bar */}
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <User className="text-white mr-2" size={20} />
          <h1 className="text-white font-bold text-lg">Dr. Portal</h1>
        </div>
        <div className="bg-blue-500 px-3 py-1 rounded-full text-xs text-white font-medium">
          Scanner
        </div>
      </div>
      
      {/* Main content container */}
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-800 p-4 text-center">
          <h2 className="text-white font-bold text-xl">Patient QR Scanner</h2>
          <p className="text-blue-100 text-sm">Scan patient ID to access medical records</p>
        </div>

        {/* Scanner area */}
        <div className="p-6">
          <div className="aspect-square rounded-xl overflow-hidden relative mb-6 border-4 border-blue-200 shadow-lg">
            {scanning ? (
              <>
                <video
                  ref={videoRef}
                  className="w-full h-full rounded-lg object-cover"
                ></video>
                <canvas ref={canvasRef} className="hidden"></canvas>
                
                {/* Scanning overlay with frame */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3/4 h-3/4 border-2 border-white/80 rounded-lg flex items-center justify-center">
                    <div className="w-5/6 h-5/6 border border-blue-500/70 rounded-md relative animate-pulse">
                      {/* Corner elements */}
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-sm"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-sm"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-sm"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-sm"></div>
                      
                      {/* Scan line animation */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-blue-400/60 animate-[scan_2s_ease-in-out_infinite]"></div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm bg-black/50 py-1.5 mx-4 rounded-md">
                  Position patient QR code within frame
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-blue-50">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <Scan size={64} className="text-blue-700" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-blue-800">Ready to Scan</h3>
                <p className="text-blue-600 text-center mb-2">
                  Access patient records instantly with QR scan
                </p>
                <p className="text-xs text-blue-500 text-center">
                  Please ensure patient consent before scanning
                </p>
              </div>
            )}
          </div>

          {message && (
            <div
              className={`text-center py-3 px-4 rounded-lg mb-4 w-full shadow-sm flex items-center justify-center ${
                message.includes("denied") || message.includes("Invalid") 
                  ? "bg-red-100 text-red-700 border border-red-200" 
                  : "bg-green-100 text-green-700 border border-green-200"
              }`}
            >
              <AlertCircle size={16} className={message.includes("denied") || message.includes("Invalid") ? "text-red-500 mr-2" : "text-green-500 mr-2"} />
              {message}
            </div>
          )}

          <button
            onClick={() => {
              setScanning(!scanning);
              setMessage("");
              setHid(null);
            }}
            className="w-full bg-blue-600 text-white py-3.5 px-6 rounded-lg hover:bg-blue-800 transition duration-300 ease-in-out font-medium flex items-center justify-center shadow-md"
          >
            <Scan size={20} className="mr-2" />
            {scanning ? "Stop Scanning" : "Start Patient Scan"}
          </button>

          {hid && (
            <div className="mt-6 text-center p-4 bg-blue-50 border border-blue-200 rounded-lg w-full shadow-sm">
              <h2 className="text-lg font-semibold text-blue-700">Patient ID</h2>
              <p className="mt-2 text-blue-800 font-mono bg-white p-2.5 rounded border border-blue-100">{hid}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom info */}
      <div className="mt-6 text-blue-100 text-xs text-center">
        <p>For technical assistance, contact IT support</p>
      </div>
    </div>
  );
}