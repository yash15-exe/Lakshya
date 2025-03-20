// components/my-components/AQIMap.jsx
import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { sendNotification } from './sendNotifications';

const AQIMap = ({ aqiData }) => {
  const [alertSent, setAlertSent] = useState({}); // Track which locations have sent alerts

  const handleSendAlert = (location) => {
    // Simulate sending an alert (e.g., API call)
    console.log(`Alert sent for ${location}`);
    const aqiInfo = aqiData.find(data => data.location === location);
    sendNotification("Air Quality Alert", `High AQI detected in ${location}! AQI: ${aqiInfo.aqi}, PM2.5: ${aqiInfo.pollution.pm2_5} µg/m³, PM10: ${aqiInfo.pollution.pm10} µg/m³, CO: ${aqiInfo.pollution.co} ppm, NO2: ${aqiInfo.pollution.no2} ppb`);
    // Update the state to indicate the alert has been sent
    setAlertSent((prev) => ({ ...prev, [location]: true }));
  };

  return (
    <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '800px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {aqiData.map((data, index) => (
        <React.Fragment key={index}>
          {/* AQI Marker */}
          <CircleMarker
            center={[data.lat, data.lng]}
            radius={data.aqi / 10}
            color={data.aqi > 100 ? 'red' : 'green'}
            fillOpacity={0.6}
          >
            <Popup>
              <div>
                <h3>Location: {data.location}</h3>
                <p><strong>AQI:</strong> {data.aqi}</p>
                <p><strong>Air Pollution Levels:</strong></p>
                <ul>
                  <li>PM2.5: {data.pollution.pm2_5} µg/m³</li> 
                  <li>PM10: {data.pollution.pm10} µg/m³</li>
                  <li>CO: {data.pollution.co} ppm</li>
                  <li>NO2: {data.pollution.no2} ppb</li>
                </ul>
                <button
                  onClick={() => handleSendAlert(data.location)}
                  disabled={alertSent[data.location]}
                  style={{
                    backgroundColor: alertSent[data.location] ? 'gray' : 'red',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  {alertSent[data.location] ? 'Alert Sent ✅' : 'Send Alert'}
                </button>
              </div>
            </Popup>
          </CircleMarker>

          {/* Water Pollution Marker */}
          <CircleMarker
            center={[data.lat + 0.02, data.lng + 0.02]} // Slightly offset for visibility
            radius={5} // Fixed size for water pollution markers
            color="blue"
            fillOpacity={0.6}
          >
            <Popup>
              <div>
                <h3>Water Pollution Levels</h3>
                <p><strong>Location:</strong> {data.location}</p>
                <p><strong>pH:</strong> {data.waterPollution.pH}</p>
                <p><strong>Dissolved Oxygen:</strong> {data.waterPollution.dissolvedOxygen} mg/L</p>
                <p><strong>Heavy Metals:</strong></p>
                <ul>
                  <li>Lead: {data.waterPollution.heavyMetals.lead} mg/L</li>
                  <li>Mercury: {data.waterPollution.heavyMetals.mercury} mg/L</li>
                </ul>
                <button
                  onClick={() => handleSendAlert(data.location)}
                  disabled={alertSent[data.location]}
                  style={{
                    backgroundColor: alertSent[data.location] ? 'gray' : 'blue',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  {alertSent[data.location] ? 'Alert Sent ✅' : 'Send Alert'}
                </button>
              </div>
            </Popup>
          </CircleMarker>
        </React.Fragment>
      ))}
    </MapContainer>
  );
};

export default AQIMap;