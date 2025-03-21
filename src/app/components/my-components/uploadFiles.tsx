import { useState } from "react";
import { db } from "@/app/lib/firebaseConfig"; // Import Firebase configuration
import { ref, set } from "firebase/database"; // Realtime Database functions

export default function FileUpload({ hid }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [serverResponse, setServerResponse] = useState(null);
  const [formData, setFormData] = useState({
    appointmentDate: "",
    diagnosis: "",
    prescription: "",
    bp: "",
    sugarLevel: "",
    weight: "",
    heartRate: "",
    doctorname:"Dr.Prashant",
    fileUrl: "", // Added fileUrl to formData
  });

  const handleFileChange = (event:any) => {
    setFile(event.target.files[0]);
  };

  const handleInputChange = (event:any) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("document", file);
    Object.keys(formData).forEach((key) => {
      uploadData.append(key, formData[key]);
    });

    setLoading(true);
    try {
      // Step 1: Upload file to the server
      const response = await fetch("https://healthbot.pythonanywhere.com/api/upload-report/", {
        method: "POST",
        body: uploadData,
      });

      const result = await response.json();
      console.log("Server Response:", result);

      // Step 2: Set the server response and file URL
      setServerResponse(result.summary);
      setFormData((prevData) => ({
        ...prevData,
        fileUrl: result.file_url, // Add fileUrl to formData
      }));

      // Step 3: Upload data to Firebase Realtime Database
      const dataToUpload = {
        ...formData,
        fileUrl: result.file_url, // Include fileUrl in Firebase data
        summary: result.summary, // Include summary in Firebase data
      };

      // Generate a unique key for the new record
      const newRecordKey = `user/${hid}/patientRecords/${Date.now()}`;
      await set(ref(db, newRecordKey), dataToUpload);

      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-96 mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
        Patient Health Record
      </h2>
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleInputChange}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="bp"
            placeholder="Blood Pressure (e.g., 120/80)"
            value={formData.bp}
            onChange={handleInputChange}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="sugarLevel"
            placeholder="Sugar Levels (e.g., 100 mg/dL)"
            value={formData.sugarLevel}
            onChange={handleInputChange}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="weight"
            placeholder="Weight (e.g., 70 kg)"
            value={formData.weight}
            onChange={handleInputChange}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="heartRate"
            placeholder="Heart Rate (e.g., 72 bpm)"
            value={formData.heartRate}
            onChange={handleInputChange}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <textarea
          name="diagnosis"
          placeholder="Diagnosis"
          value={formData.diagnosis}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
        />
        <textarea
          name="prescription"
          placeholder="Prescription"
          value={formData.prescription}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
        />
        <div className="flex items-center justify-between">
          <label className="cursor-pointer bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition duration-300">
            <span>{file ? file.name : "Choose File"}</span>
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>

      {/* Display Server Response */}
      {serverResponse && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
          <h3 className="font-bold text-lg mb-2">Summary:</h3>
          <pre className="whitespace-pre-wrap text-sm">
            {JSON.stringify(JSON.parse(serverResponse), null, 2)}
          </pre>
        </div>
      )}

      {/* Upload Success Message */}
      {uploadSuccess && (
        <div className="mt-4 p-3 bg-green-100 text-green-600 rounded-lg text-center animate-fade-in">
          Upload successful! 🎉
        </div>
      )}
    </div>
  );
}