export const aqiData = [
    {
      lat: 19.076,
      lng: 72.8777,
      aqi: 120,
      location: 'Mumbai - CST',
      pollution: {
        pm2_5: 55,
        pm10: 110,
        co: 1.0,
        no2: 40,
      },
      waterPollution: {
        pH: 7.0,
        dissolvedOxygen: 5.0, // mg/L
        heavyMetals: {
          lead: 0.015, // mg/L
          mercury: 0.001, // mg/L
        },
      },
    },
    {
      lat: 19.1071,
      lng: 72.8347,
      aqi: 140,
      location: 'Mumbai - Andheri',
      pollution: {
        pm2_5: 60,
        pm10: 130,
        co: 1.1,
        no2: 42,
      },
      waterPollution: {
        pH: 6.8,
        dissolvedOxygen: 4.8, // mg/L
        heavyMetals: {
          lead: 0.017, // mg/L
          mercury: 0.002, // mg/L
        },
      },
    },
    {
      lat: 19.2288,
      lng: 72.8544,
      aqi: 160,
      location: 'Mumbai - Borivali',
      pollution: {
        pm2_5: 75,
        pm10: 140,
        co: 1.2,
        no2: 50,
      },
      waterPollution: {
        pH: 6.7,
        dissolvedOxygen: 4.5, // mg/L
        heavyMetals: {
          lead: 0.02, // mg/L
          mercury: 0.003, // mg/L
        },
      },
    },
    {
      lat: 19.033,
      lng: 72.855,
      aqi: 110,
      location: 'Mumbai - Dadar',
      pollution: {
        pm2_5: 50,
        pm10: 105,
        co: 0.9,
        no2: 35,
      },
      waterPollution: {
        pH: 7.2,
        dissolvedOxygen: 5.5, // mg/L
        heavyMetals: {
          lead: 0.012, // mg/L
          mercury: 0.0015, // mg/L
        },
      },
    },
    {
      lat: 19.0514,
      lng: 72.8925,
      aqi: 135,
      location: 'Mumbai - Chembur',
      pollution: {
        pm2_5: 65,
        pm10: 125,
        co: 1.3,
        no2: 45,
      },
      waterPollution: {
        pH: 6.9,
        dissolvedOxygen: 4.7, // mg/L
        heavyMetals: {
          lead: 0.018, // mg/L
          mercury: 0.0025, // mg/L
        },
      },
    },
  ];
  export const outbreaks = [
    {
      center: [19.076, 72.8777], // Mumbai - CST
      radius: 1200, // Radius in meters
      name: "Outbreak Cluster 1",
      cases: 200,
    },
    {
      center: [19.1071, 72.8347], // Mumbai - Andheri
      radius: 900, // Radius in meters
      name: "Outbreak Cluster 2",
      cases: 150,
    },
    {
      center: [19.2288, 72.8544], // Mumbai - Borivali
      radius: 1000, // Radius in meters
      name: "Outbreak Cluster 3",
      cases: 180,
    },
    {
      center: [19.033, 72.855], // Mumbai - Dadar
      radius: 700, // Radius in meters
      name: "Outbreak Cluster 4",
      cases: 130,
    },
    {
      center: [19.0514, 72.8925], // Mumbai - Chembur
      radius: 1100, // Radius in meters
      name: "Outbreak Cluster 5",
      cases: 220,
    },
  ];
  