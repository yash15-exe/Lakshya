"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/app/lib/firebaseConfig";
import { ref, get } from "firebase/database";

export default function ScanPage() {
  const { id: hid } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hid) {
      fetchData(hid);
    }
  }, [hid]);

  const fetchData = async (hid: string) => {
    setLoading(true);
    setError(null);

    try {
      const snapshot = await get(ref(db, `user/${hid}`)); // Assuming data is stored under 'scans/hid'
      if (snapshot.exists()) {
        setData(snapshot.val());
      } else {
        setError("No data found for this ID.");
      }
    } catch (err) {
      setError("Error fetching data.");
      console.error("Firebase Error:", err);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-6 font-inter">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight font-poppins">Patient Information</h1>
      {loading && <p className="text-blue-600 mt-4 font-medium">Loading...</p>}
      {error && <p className="text-red-600 mt-4 font-medium">{error}</p>}
      {data ? (
        <div className="mt-4 bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
          <h2 className="text-2xl font-semibold mb-6 text-blue-800 border-b pb-2 tracking-tight font-poppins">User Details</h2>
          <EnhancedDataDisplay data={data} />
        </div>
      ) : (
        !loading && !error && <p className="mt-4 text-gray-700 font-medium">No data available.</p>
      )}
    </div>
  );
}

const EnhancedDataDisplay = ({ data }: { data: any }) => {
  // Function to format keys for better readability
  const formatKey = (key: string) => {
    return key
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Determine if this is a top-level section that should be displayed as a card
  const isTopLevelSection = (key: string, value: any) => {
    return typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length > 0;
  };

  // Format date strings if they match a date pattern
  const formatValue = (value: any) => {
    if (typeof value === 'string') {
      // Check if it's a date string (simple check)
      const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
      if (datePattern.test(value)) {
        return new Date(value).toLocaleString();
      }
    }
    return value === null ? 'Not provided' : String(value);
  };

  if (typeof data !== 'object' || data === null) {
    return <p className="text-gray-800">{formatValue(data)}</p>;
  }

  if (Array.isArray(data)) {
    return (
      <div className="bg-gray-50 p-3 rounded-md">
        {data.length > 0 ? (
          <ul className="space-y-2">
            {data.map((item, index) => (
              <li key={index} className="border-b pb-2 last:border-b-0">
                <EnhancedDataDisplay data={item} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No items</p>
        )}
      </div>
    );
  }

  // Group data into sections for better organization
  const sections: Record<string, any> = {};
  const simpleFields: Record<string, any> = {};

  Object.entries(data).forEach(([key, value]) => {
    // Skip internal fields or empty objects
    if (key.startsWith('_') || (typeof value === 'object' && value !== null && Object.keys(value).length === 0)) {
      return;
    }

    if (isTopLevelSection(key, value)) {
      sections[key] = value;
    } else {
      simpleFields[key] = value;
    }
  });

  return (
    <div className="space-y-6">
      {/* Display simple fields in a table layout */}
      {Object.keys(simpleFields).length > 0 && (
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full border-collapse bg-white text-left text-sm text-gray-700">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold text-gray-900 w-1/3 text-base">Field</th>
                <th scope="col" className="px-6 py-4 font-semibold text-gray-900 w-2/3 text-base">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              {Object.entries(simpleFields).map(([key, value], index) => (
                <tr key={key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
                  <td className="px-6 py-4 font-medium text-gray-800">{formatKey(key)}</td>
                  <td className="px-6 py-4 text-gray-600">{formatValue(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Display complex sections as cards with improved styling */}
      {Object.entries(sections).map(([key, value]) => (
        <div key={key} className="border rounded-lg overflow-hidden bg-white shadow-sm">
          <div className="bg-blue-50 px-6 py-3 border-b border-gray-200">
            <h3 className="font-semibold text-lg text-blue-700 tracking-tight">{formatKey(key)}</h3>
          </div>
          <div className="p-4">
            <EnhancedDataDisplay data={value} />
          </div>
        </div>
      ))}
    </div>
  );
};
