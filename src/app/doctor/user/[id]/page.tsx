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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-gray-900">Scanned ID Data</h1>
      {loading && <p className="text-blue-500 mt-4">Loading...</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {data ? (
        <div className="mt-4 bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Fetched Data:</h2>
          <RecursiveRenderer data={data} />
        </div>
      ) : (
        !loading && !error && <p className="mt-4 text-gray-700">No data available.</p>
      )}
    </div>
  );
}

const RecursiveRenderer = ({ data }: { data: any }) => {
  if (typeof data === "string" || typeof data === "number" || typeof data === "boolean") {
    return <p className="text-gray-800">{String(data)}</p>;
  }
  if (Array.isArray(data)) {
    return (
      <ul className="list-disc list-inside ml-4">
        {data.map((item, index) => (
          <li key={index}><RecursiveRenderer data={item} /></li>
        ))}
      </ul>
    );
  }
  if (typeof data === "object" && data !== null) {
    return (
      <div className="border-l-4 border-blue-500 pl-4 mb-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="mb-2">
            <h3 className="font-semibold text-lg text-blue-600">{key.replace(/_/g, " ")}</h3>
            <RecursiveRenderer data={value} />
          </div>
        ))}
      </div>
    );
  }
  return null;
};
