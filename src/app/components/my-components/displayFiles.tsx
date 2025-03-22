import { useState, useEffect } from 'react';
import { ref, get, getDatabase } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { Document, Page, pdfjs } from 'react-pdf';
import { db as database } from '@/app/lib/firebaseConfig';

// Initialize pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PatientRecordsViewer = ({ hid }) => {
  const [patientRecords, setPatientRecords] = useState({});
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientRecords = async () => {
      try {
        setLoading(true);
        const patientRecordsRef = ref(database, `user/${hid}/patientRecords`);
        const snapshot = await get(patientRecordsRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          setPatientRecords(data);
          
          // Set first patient as selected by default if exists
          const patientIds = Object.keys(data);
          if (patientIds.length > 0) {
            setSelectedPatientId(patientIds[0]);
          }
        } else {
          console.log("No patient records available");
        }
      } catch (err) {
        console.error("Error fetching patient records:", err);
        setError("Failed to load patient records. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (hid) {
      fetchPatientRecords();
    }
  }, [hid]);

  const handlePatientSelect = (patientId) => {
    setSelectedPatientId(patientId);
    setSelectedFile(null); // Reset selected file when changing patients
  };

  const handleFileSelect = (fileUrl, fileName) => {
    setSelectedFile({
      url: fileUrl,
      name: fileName || 'Document'
    });
    setPageNumber(1); // Reset to first page when opening a new document
  };

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.min(Math.max(1, newPageNumber), numPages);
    });
  };

  const renderPatientInfo = (patientData) => {
    if (!patientData) return null;

    return (
      <div className="bg-white p-4 rounded-md shadow mb-4">
        <h3 className="text-lg font-medium mb-2">Patient Information</h3>
        <div className="grid grid-cols-2 gap-2">
          {patientData.appointmentDate && (
            <div>
              <span className="font-medium">Appointment:</span> {patientData.appointmentDate}
            </div>
          )}
          {patientData.doctorname && (
            <div>
              <span className="font-medium">Doctor:</span> {patientData.doctorname}
            </div>
          )}
          {patientData.diagnosis && (
            <div className="col-span-2">
              <span className="font-medium">Diagnosis:</span> {patientData.diagnosis}
            </div>
          )}
          {patientData.bp && (
            <div>
              <span className="font-medium">BP:</span> {patientData.bp}
            </div>
          )}
          {patientData.heartRate && (
            <div>
              <span className="font-medium">Heart Rate:</span> {patientData.heartRate}
            </div>
          )}
          {patientData.prescription && (
            <div className="col-span-2">
              <span className="font-medium">Prescription:</span> {patientData.prescription}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Patient Records Viewer</h1>
      
      {loading && <p className="text-gray-600">Loading patient records...</p>}
      {error && <p className="text-red-600">{error}</p>}
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Patient List Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Patients</h2>
            
            {Object.keys(patientRecords).length > 0 ? (
              <div className="flex flex-col gap-2">
                {Object.keys(patientRecords).map(patientId => (
                  <button
                    key={patientId}
                    className={`p-3 rounded-md text-left transition-colors ${
                      selectedPatientId === patientId 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white hover:bg-blue-100'
                    }`}
                    onClick={() => handlePatientSelect(patientId)}
                  >
                    Patient ID: {patientId}
                  </button>
                ))}
              </div>
            ) : !loading && (
              <p className="text-gray-600">No patient records found</p>
            )}
          </div>
        </div>
        
        {/* Patient Details and File Viewer */}
        <div className="w-full md:w-3/4">
          {selectedPatientId ? (
            <div>
              {renderPatientInfo(patientRecords[selectedPatientId])}
              
              {/* File buttons */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Documents</h3>
                <div className="flex flex-wrap gap-2">
                  {patientRecords[selectedPatientId]?.fileUrl && (
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      onClick={() => handleFileSelect(
                        patientRecords[selectedPatientId].fileUrl,
                        'Medical Report'
                      )}
                    >
                      Medical Report
                    </button>
                  )}
                  
                  {/* Display any QR code URL as a button too */}
                  {patientRecords[selectedPatientId]?.qrCodeURL && (
                    <button
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                      onClick={() => handleFileSelect(
                        patientRecords[selectedPatientId].qrCodeURL,
                        'QR Code'
                      )}
                    >
                      QR Code
                    </button>
                  )}
                </div>
                {(!patientRecords[selectedPatientId]?.fileUrl && !patientRecords[selectedPatientId]?.qrCodeURL) && (
                  <p className="text-gray-600">No documents available for this patient</p>
                )}
              </div>
              
              {/* PDF Viewer */}
              {selectedFile && (
                <div className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{selectedFile.name}</h2>
                    <div className="flex items-center gap-2">
                      <button
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                        onClick={() => changePage(-1)}
                        disabled={pageNumber <= 1}
                      >
                        Previous
                      </button>
                      <span className="text-sm">
                        Page {pageNumber} of {numPages || '?'}
                      </span>
                      <button
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                        onClick={() => changePage(1)}
                        disabled={pageNumber >= numPages}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden bg-gray-100 flex justify-center">
                    <Document
                      file={selectedFile.url}
                      onLoadSuccess={handleDocumentLoadSuccess}
                      loading={<div className="p-20 text-center">Loading document...</div>}
                      error={<div className="p-20 text-center text-red-600">Failed to load document</div>}
                    >
                      <Page 
                        pageNumber={pageNumber} 
                        width={600}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    </Document>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-20 text-center text-gray-600">
              Select a patient to view their records
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientRecordsViewer;