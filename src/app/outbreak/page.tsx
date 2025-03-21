"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebaseConfig";
import { ref, get, update } from "firebase/database";
import { outbreaks, aqiData } from "@/constants";
import OutbreakMap from "@/app/components/my-components/outbreakMap";
import { sendNotification } from "@/app/components/my-components/sendNotifications";
import { fetchFCMTokens } from "@/app/components/my-components/fetchFCM";
import { useRouter } from "next/navigation";

const AQIMap = dynamic(() => import("@/app/components/my-components/aqiMap"), {
  ssr: false,
});

export default function Home() {
  const [userReports, setUserReports] = useState([] as any);
  const [activeTab, setActiveTab] = useState("maps");
  const [minCases, setMinCases] = useState(0);
  const [maxRadius, setMaxRadius] = useState(Infinity);
  const [selectedDisease, setSelectedDisease] = useState("All");
  const router = useRouter();

  const groupOutbreaksByDisease = (outbreaks:any) => {
    const groupedOutbreaks = new Map();

    outbreaks.forEach((outbreak:any) => {
      if (!groupedOutbreaks.has(outbreak.name)) {
        groupedOutbreaks.set(outbreak.name, []);
      }
      groupedOutbreaks.get(outbreak.name).push(outbreak);
    });
    console.log(groupedOutbreaks);

    return groupedOutbreaks;
  };

  const groupedOutbreaks = groupOutbreaksByDisease(outbreaks);
  const uniqueDiseases = Array.from(groupedOutbreaks.keys());

  const handleDiseaseChange = (e:any) => {
    setSelectedDisease(e.target.value);
  };

  const filteredOutbreaks = selectedDisease === "All" 
    ? outbreaks 
    : groupedOutbreaks.get(selectedDisease) || [];

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
      {/* Header with Navigation */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white py-8 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                National Health<br />Monitoring System
              </h1>
            </div>
            <div className="flex flex-wrap gap-3 justify-center md:justify-end">
              <button 
                onClick={() => router.push('/analysis')}
                className="bg-white text-indigo-900 hover:bg-indigo-50 px-4 py-2 rounded-md font-medium shadow-sm transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Add New User
              </button>
              <button 
                onClick={() => {
                  setActiveTab("maps");
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white text-indigo-900 hover:bg-indigo-50 px-4 py-2 rounded-md font-medium shadow-sm transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Outbreak Analysis
              </button>
              <button 
                onClick={() => {
                  setActiveTab("reports");
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white text-indigo-900 hover:bg-indigo-50 px-4 py-2 rounded-md font-medium shadow-sm transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Reporting Analysis
              </button>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div className="h-1 w-16 bg-blue-400 rounded mr-2"></div>
            <p className="text-blue-100">
              Official government platform for monitoring and responding to public health incidents
            </p>
          </div>
        </div>
      </div>

      {/* Filters - Only show for maps tab */}
      {activeTab === "maps" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          {/* Filters have been removed */}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Maps Section */}
        {activeTab === "maps" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Disease Outbreak Monitoring
              </h2>
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Map */}
                <div className="lg:w-2/3 bg-white rounded-lg overflow-hidden border border-gray-200">
                  <div className="p-4">
                    <OutbreakMap outbreaks={filteredOutbreaks} />
                  </div>
                </div>
                
                {/* Filter Sidebar */}
                <div className="lg:w-1/3 bg-white rounded-lg overflow-hidden border border-gray-200 p-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    Filter Outbreaks
                  </h3>
                  
                  {/* Disease Filter */}
                  <div className="mb-6">
                    <label htmlFor="diseaseFilter" className="block text-sm font-medium text-gray-700 mb-2">
                      Select Disease
                    </label>
                    <select
                      id="diseaseFilter"
                      value={selectedDisease}
                      onChange={handleDiseaseChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="All">All Diseases</option>
                      <option value="Dengue Outbreak">Dengue</option>
                      <option value="Cholera Outbreak">Cholera</option>
                      <option value="Typhoid Outbreak">Typhoid</option>
                      <option value="Hepatitis A Outbreak">Hepatitis A</option>
                      <option value="Malaria Outbreak">Malaria</option>
                    </select>
                  </div>
                  
                  {/* Calendar Filter */}
                  <div>
                    <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Date
                    </label>
                    <input
                      type="date"
                      id="dateFilter"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      onChange={(e) => {
                        // Here you would implement date filtering logic
                        console.log("Selected date:", e.target.value);
                        // For now, we'll just log the date
                      }}
                    />
                  </div>
                  
                  {/* Disease Statistics */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="text-md font-medium text-gray-800 mb-3">
                      Current Outbreak Statistics
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Cases:</span>
                        <span className="font-medium">{filteredOutbreaks.reduce((sum, outbreak) => sum + outbreak.cases, 0)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Affected Areas:</span>
                        <span className="font-medium">{filteredOutbreaks.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Last Updated:</span>
                        <span className="text-sm text-gray-500">{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Reports Section - unchanged */}
        {activeTab === "reports" && (
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
        )}
      </div>
    </div>
  );
}