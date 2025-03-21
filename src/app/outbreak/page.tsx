"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebaseConfig";
import { ref, get, update } from "firebase/database";
import { outbreaks, aqiData } from "@/constants";
import OutbreakMap from "@/app/components/my-components/outbreakMap";
import { sendNotification } from "@/app/components/my-components/sendNotifications";
import { fetchFCMTokens } from "@/app/components/my-components/fetchFCM";
// Dynamically import AQIMap with SSR disabled
const AQIMap = dynamic(() => import("@/app/components/my-components/aqiMap"), {
  ssr: false,
});

export default function Home() {
  const [userReports, setUserReports] = useState([]);

  useEffect(() => {
    const fetchUserReports = async () => {
      try {
        const reportsRef = ref(db, "reports"); // Reference to the 'reports' node
        const snapshot = await get(reportsRef);

        if (snapshot.exists()) {
          const reportsData = snapshot.val();
          const reportsArray = Object.keys(reportsData).map((key) => ({
            id: key,
            ...reportsData[key],
          }));
          setUserReports(reportsArray);
        } else {
          console.log("No reports found");
        }
      } catch (error) {
        console.error("Error fetching user reports:", error);
      }
    };

    fetchUserReports();
  }, []);

  // Function to update the status of a report
  const updateReportStatus = async ({
    reportId,
    newStatus,
  }: {
    reportId: any;
    newStatus: any;
  }) => {
    try {
      const reportRef = ref(db, `reports/${reportId}`);
      await update(reportRef, { status: newStatus });

      // Update the local state to reflect the change
      setUserReports((prevReports: any) =>
        prevReports.map((report: any) =>
          report.id === reportId ? { ...report, status: newStatus } : report
        )
      );

      console.log(`Status updated to ${newStatus} for report ${reportId}`);
    } catch (error) {
      console.error("Error updating report status:", error);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-8">
      {/* Maps Section */}
      <h1 className="text-center font-semibold text-4xl">
        Realtime Analysis and Action
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-2 border-black rounded-md">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h1 className="text-xl font-semibold mb-4">Outbreak Analysis</h1>
          <OutbreakMap outbreaks={outbreaks} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h1 className="text-xl font-semibold mb-4">AQI Analysis</h1>
          <AQIMap aqiData={aqiData} />
        </div>
      </div>

      {/* User Reports Section */}
      <div>
        <h1 className="text-4xl font-bold mb-6 text-center ">User Reports</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-2 border-black">
          {userReports.map((report: any) => (
            <div
              key={report.id}
              className="p-5 border rounded-lg shadow-md bg-white flex flex-col md:flex-row gap-4"
            >
              {/* Image Section */}
              {report.imageUrl && (
                <div className="w-full md:w-40 h-40 flex-shrink-0">
                  <img
                    src={report.imageUrl}
                    alt="Report"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Report Details Section */}
              <div className="flex-1 space-y-3">
                {/* Location */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase">
                    Location
                  </label>
                  <p className="text-lg font-semibold text-gray-800">
                    {report.location}
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase">
                    Description
                  </label>
                  <p className="text-gray-600">{report.description}</p>
                </div>

                {/* Timestamp */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase">
                    Reported On
                  </label>
                  <p className="text-sm text-gray-500">
                    {new Date(report.timestamp).toLocaleString()}
                  </p>
                </div>

                {/* Status Section */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase">
                    Status
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => {
                        updateReportStatus(report.id, "Acknowledged");
                        sendNotification(
                          "Heyy!!",
                          "Your report has been acknowledged"
                        );
                      }}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        report.status === "Acknowledged"
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      }`}
                    >
                      Acknowledge
                    </button>
                    <button
                      onClick={() => {
                        updateReportStatus(report.id, "Resolved");
                        sendNotification(
                          "Heyy!!",
                          "Your report has been resolved"
                        );
                      }}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        report.status === "Resolved"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      }`}
                    >
                      Resolved
                    </button>
                    <button
                      onClick={() => updateReportStatus(report.id, "Pending")}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        report.status === "Pending"
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      }`}
                    >
                      Pending
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
