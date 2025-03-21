"use client";
import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebaseConfig";
import { ref, get, update } from "firebase/database";
import { sendNotification } from "@/app/components/my-components/sendNotifications";
import Newnavbar from "@/app/components/ui/Newnavbar";

export default function ReportingAnalysis() {
  const [userReports, setUserReports] = useState([]);
  const [activeTab, setActiveTab] = useState("reports");

  // Fetch user reports from Firebase
  useEffect(() => {
    const fetchUserReports = async () => {
      try {
        const reportsRef = ref(db, "reports");
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

  // Function to update report status
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

  // Helper function to generate status badges
  const getStatusBadge = (status: string) => {
    const statusClasses = {
      Acknowledged: "bg-green-100 text-green-800 border-green-300",
      Resolved: "bg-blue-100 text-blue-800 border-blue-300",
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      default: "bg-gray-100 text-gray-800 border-gray-300",
    };
    
    return (
      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${statusClasses[status] || statusClasses.default}`}>
        {status || "New"}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Newnavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Community Health Reports
              </h2>
              <span className="bg-indigo-100 text-indigo-800 py-1 px-3 rounded-full text-sm font-medium">
                {userReports.length} Reports
              </span>
            </div>

            <div className="space-y-4">
              {userReports.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No reports</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No community health reports have been submitted yet.
                  </p>
                </div>
              ) : (
                userReports.map((report: any) => (
                  <div
                    key={report.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="p-5 flex flex-col md:flex-row gap-6">
                      {/* Image Section */}
                      {report.imageUrl && (
                        <div className="w-full md:w-48 h-48 flex-shrink-0">
                          <img
                            src={report.imageUrl}
                            alt="Report"
                            className="w-full h-full object-cover rounded-lg border border-gray-200"
                          />
                        </div>
                      )}

                      {/* Report Details Section */}
                      <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {report.location}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Reported on {new Date(report.timestamp).toLocaleString()}
                            </p>
                          </div>
                          {getStatusBadge(report.status)}
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-gray-700">{report.description}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 pt-2">
                          <button
                            onClick={() => {
                              updateReportStatus({
                                reportId: report.id,
                                newStatus: "Acknowledged",
                              });
                              sendNotification(
                                "Report Update",
                                "Your report has been acknowledged"
                              );
                            }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                              report.status === "Acknowledged"
                                ? "bg-green-600 text-white"
                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            Acknowledge
                          </button>
                          <button
                            onClick={() => {
                              updateReportStatus({
                                reportId: report.id,
                                newStatus: "Resolved",
                              });
                              sendNotification(
                                "Report Update",
                                "Your report has been resolved"
                              );
                            }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                              report.status === "Resolved"
                                ? "bg-blue-600 text-white"
                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            Resolve
                          </button>
                          <button
                            onClick={() => 
                              updateReportStatus({
                                reportId: report.id,
                                newStatus: "Pending",
                              })
                            }
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                              report.status === "Pending"
                                ? "bg-yellow-500 text-white"
                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            Mark Pending
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}