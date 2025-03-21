"use client";
import { useRouter } from "next/navigation";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Newnavbar({ activeTab, setActiveTab }: NavbarProps) {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-r from-green-900 to-green-800 text-white py-8 px-6 shadow-lg">
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
                router.push('/outbreak')
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`${activeTab === "maps" ? "bg-indigo-100" : "bg-white"} text-indigo-900 hover:bg-indigo-50 px-4 py-2 rounded-md font-medium shadow-sm transition-colors flex items-center`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Outbreak Analysis
            </button>
            <button 
              onClick={() => {
                router.push('/reporting')
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`${activeTab === "reports" ? "bg-indigo-100" : "bg-white"} text-indigo-900 hover:bg-indigo-50 px-4 py-2 rounded-md font-medium shadow-sm transition-colors flex items-center`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Reporting Analysis
            </button>
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <div className="h-1 w-16 bg-green-400 rounded mr-2"></div>
          <p className="text-green-100">
            Official government platform for monitoring and responding to public health incidents
          </p>
        </div>
      </div>
    </div>
  );
}