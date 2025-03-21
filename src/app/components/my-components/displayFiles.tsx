import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { Card, CardContent } from "@/app/components/ui/card";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const ReportsList = () => {
  const [reports, setReports] = useState([] as any);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getDatabase();
    const reportsRef = ref(db, "reports");

    const unsubscribe = onValue(reportsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setReports(Object.entries(data).map(([id, report]) => ({ id, ...report as any})));
      } else {
        setReports([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading reports...</p>;
  if (reports.length === 0) return <p>No reports found.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {reports.map((report :any) => (
        <Card key={report.id} className="p-4 shadow-md">
          <CardContent>
            <h3 className="text-lg font-semibold">{report.title || "Untitled Report"}</h3>
            <p className="text-sm text-gray-600">{report.description || "No description available."}</p>
            {report.pdfUrl && (
              <div className="mt-4">
                <h4 className="text-md font-medium">Report Preview:</h4>
                <div className="border border-gray-300 rounded-md overflow-hidden h-64">
                  <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}>
                    <Viewer fileUrl={report.pdfUrl} />
                  </Worker>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReportsList;
