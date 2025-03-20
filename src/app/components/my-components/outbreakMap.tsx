"use client";

import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "@/components/ui/button"; // Import your button component
import { getMessaging, getToken } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/lib/firebaseConfig";
// Fix for default marker icons in Leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { sendNotification } from "./sendNotifications";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

// Firebase configuration


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

interface Outbreak {
  center: [number, number]; // [latitude, longitude]
  radius: number; // Radius in meters
  name?: string; // Optional: Name of the outbreak
  cases?: number; // Optional: Number of cases
}

interface OutbreakMapProps {
  outbreaks: Outbreak[]; // Array of outbreaks
}

export default function OutbreakMap({ outbreaks }: OutbreakMapProps) {
  // Calculate the map center based on the first outbreak (or a default center)
  const mapCenter = outbreaks.length > 0 ? outbreaks[0].center : [51.505, -0.09];

  // Request permission and get FCM token


  return (
    <div className="h-[800px] w-full rounded-lg overflow-hidden">
      <MapContainer
        center={mapCenter}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        {/* TileLayer for the map background */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Render a Circle for each outbreak */}
        {outbreaks.map((outbreak, index) => (
          <Circle
            key={index}
            center={outbreak.center}
            radius={outbreak.radius}
            pathOptions={{ color: "red", fillColor: "red", fillOpacity: 0.2 }}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold">
                  {outbreak.name || `Outbreak Cluster ${index + 1}`}
                </h3>
                <p>Radius: {outbreak.radius} meters</p>
                {outbreak.cases && <p>Cases: {outbreak.cases}</p>}
                <Button
                  onClick={() =>
                    sendNotification(
                        "Outbreak Alert",
                        `Outbreak detected for ${outbreak.name}!`
                    )
                  }
                  className="mt-2"
                >
                  Send Alert
                </Button>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
}