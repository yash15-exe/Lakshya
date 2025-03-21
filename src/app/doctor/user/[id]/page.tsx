"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/app/lib/firebaseConfig";
import { ref, get } from "firebase/database";
import FileUpload from "@/app/components/my-components/uploadFiles";
import { 
  User, 
  Calendar, 
  Activity, 
  Heart, 
  Clipboard, 
  AlertCircle, 
  FileText,
  Phone,
  MapPin,
  Info,
  Mail,
  Clock,
  Shield,
  AlertTriangle,
  Pill,
  Gauge,
  Ruler,
  Weight,
  BarChart,
  Upload
} from "lucide-react";

export default function ScanPage() {
  const { id: hid } = useParams<{ id: string }>();
  const [patientData, setPatientData] = useState<any>(null);
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
      const snapshot = await get(ref(db, `user/${hid}`));
      if (snapshot.exists()) {
        setPatientData(snapshot.val());
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6 font-inter">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 tracking-tight font-poppins">
            Patient Summary
          </h1>
          <p className="text-blue-600 mt-2">Comprehensive health profile and information</p>
        </div>
        
        {loading && (
          <div className="w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-gradient-to-r from-blue-300 to-blue-200 h-24 w-24 mb-4"></div>
              <div className="h-5 bg-blue-200 rounded-full w-1/2 mb-3"></div>
              <div className="h-4 bg-blue-100 rounded-full w-1/3 mb-2"></div>
              <div className="h-4 bg-blue-100 rounded-full w-1/4"></div>
            </div>
            <p className="text-blue-600 mt-6 font-medium">Loading patient profile...</p>
          </div>
        )}
        
        {error && (
          <div className="w-full bg-white rounded-xl shadow-lg p-8 text-center border-l-4 border-red-500">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-medium text-lg">{error}</p>
            <p className="text-gray-500 mt-2">Please check the patient ID and try again.</p>
          </div>
        )}
        
        {patientData ? (
          <div className="mt-4 w-full space-y-8">
            <PatientSummary data={patientData} />
            <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold mb-6 text-blue-800 border-b pb-2 tracking-tight font-poppins flex items-center">
                <Upload className="mr-3 text-blue-600" size={20} />
                Upload Patient Documents
              </h2>
              <FileUpload hid={hid} />
            </div>
          </div>
        ) : (
          !loading && !error && (
            <div className="w-full bg-white rounded-xl shadow-lg p-8 text-center">
              <Info size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="mt-4 text-gray-700 font-medium">No patient data available.</p>
              <p className="text-gray-500 mt-2">Please try a different patient ID.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

const PatientSummary = ({ data }: { data: any }) => {
  // Extract patient's basic information
  const extractPatientInfo = (data: any) => {
    const info: any = {
      name: "Not Available",
      age: "Not Available",
      dob: "Not Available",
      gender: "Not Available",
      contactNumber: "Not Available",
      email: "Not Available",
      address: "Not Available"
    };
    
    // Helper function to search through nested objects
    const findValue = (obj: any, keys: string[]) => {
      if (!obj || typeof obj !== 'object') return null;
      
      for (const key in obj) {
        const lowerKey = key.toLowerCase();
        
        // Check if this key matches what we're looking for
        if (keys.some(k => lowerKey.includes(k))) {
          return obj[key];
        }
        
        // If this is an object but not an array, recursively search it
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          const result = findValue(obj[key], keys);
          if (result) return result;
        }
      }
      
      return null;
    };
    
    // Try to find patient name from various possible fields
    info.name = findValue(data, ['name', 'fullname', 'patient_name']) || info.name;
    
    // Try to find age
    info.age = findValue(data, ['age', 'years']) || info.age;
    
    // Try to find date of birth
    const dob = findValue(data, ['dob', 'birth', 'birthday', 'birthdate']);
    if (dob && typeof dob === 'string') {
      const datePattern = /^\d{4}-\d{2}-\d{2}/;
      if (datePattern.test(dob)) {
        info.dob = new Date(dob).toLocaleDateString();
      } else {
        info.dob = dob;
      }
    }
    
    // Try to find gender
    info.gender = findValue(data, ['gender', 'sex']) || info.gender;
    
    // Try to find contact number
    info.contactNumber = findValue(data, ['phone', 'mobile', 'contact', 'tel']) || info.contactNumber;
    
    // Try to find email
    info.email = findValue(data, ['email', 'mail']) || info.email;
    
    // Try to find address
    const address = findValue(data, ['address', 'location', 'residence']);
    if (address) {
      if (typeof address === 'object') {
        // If address is an object, combine its values
        info.address = Object.values(address).filter(v => v).join(', ');
      } else {
        info.address = address;
      }
    }
    
    return info;
  };
  
  // Extract medical data
  const extractMedicalInfo = (data: any) => {
    const info: any = {
      conditions: [],
      allergies: [],
      medications: [],
      bloodType: "Not Available",
      height: "Not Available",
      weight: "Not Available",
      bmi: "Not Available",
      bloodPressure: "Not Available",
      heartRate: "Not Available"
    };
    
    // Look for medical section
    const medicalSection = findNestedObject(data, ['medical', 'health', 'clinical']);
    
    if (medicalSection) {
      // Extract conditions
      const conditions = findNestedArray(medicalSection, ['condition', 'diagnosis', 'problem']);
      if (conditions) info.conditions = conditions;
      
      // Extract allergies
      const allergies = findNestedArray(medicalSection, ['allergy', 'allergies']);
      if (allergies) info.allergies = allergies;
      
      // Extract medications
      const medications = findNestedArray(medicalSection, ['medication', 'medicine', 'drug']);
      if (medications) info.medications = medications;
      
      // Extract vitals
      const vitals = findNestedObject(medicalSection, ['vital', 'measurement', 'sign']);
      if (vitals) {
        for (const key in vitals) {
          const lowerKey = key.toLowerCase();
          if (lowerKey.includes('blood_type') || lowerKey.includes('bloodtype')) {
            info.bloodType = vitals[key];
          } else if (lowerKey.includes('height')) {
            info.height = vitals[key];
          } else if (lowerKey.includes('weight')) {
            info.weight = vitals[key];
          } else if (lowerKey.includes('bmi')) {
            info.bmi = vitals[key];
          } else if (lowerKey.includes('blood_pressure') || lowerKey.includes('bp')) {
            info.bloodPressure = vitals[key];
          } else if (lowerKey.includes('heart') || lowerKey.includes('pulse')) {
            info.heartRate = vitals[key];
          }
        }
      }
    }
    
    return info;
  };
  
  // Helper function to find nested objects
  const findNestedObject = (obj: any, keys: string[]) => {
    if (!obj || typeof obj !== 'object') return null;
    
    for (const key in obj) {
      const lowerKey = key.toLowerCase();
      
      // Check if this key matches what we're looking for
      if (keys.some(k => lowerKey.includes(k))) {
        return obj[key];
      }
      
      // If this is an object but not an array, recursively search it
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        const result = findNestedObject(obj[key], keys);
        if (result) return result;
      }
    }
    
    return null;
  };
  
  // Helper function to find and extract array data
  const findNestedArray = (obj: any, keys: string[]) => {
    if (!obj || typeof obj !== 'object') return null;
    
    for (const key in obj) {
      const lowerKey = key.toLowerCase();
      
      // Check if this key matches what we're looking for
      if (keys.some(k => lowerKey.includes(k))) {
        if (Array.isArray(obj[key])) {
          return obj[key];
        } else if (typeof obj[key] === 'object') {
          // If it's an object, try to convert to array
          return Object.values(obj[key]);
        } else {
          // If it's a single value, wrap in array
          return [obj[key]];
        }
      }
      
      // If this is an object but not an array, recursively search it
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        const result = findNestedArray(obj[key], keys);
        if (result) return result;
      }
    }
    
    return null;
  };
  
  const patientInfo = extractPatientInfo(data);
  const medicalInfo = extractMedicalInfo(data);
  
  // Get patient initials for avatar
  const getInitials = (name: string) => {
    if (name === "Not Available") return "PA";
    
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Determine gender color
  const getGenderColor = (gender: string) => {
    if (!gender || gender === "Not Available") return "bg-gray-200 text-gray-600";
    
    const g = gender.toLowerCase();
    if (g.includes('male') || g.includes('m')) return "bg-blue-100 text-blue-700";
    if (g.includes('female') || g.includes('f')) return "bg-pink-100 text-pink-700";
    
    return "bg-purple-100 text-purple-700";
  };
  
  return (
    <div className="space-y-8">
      {/* Patient Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 px-8 py-6">
          <h3 className="font-semibold text-xl text-white tracking-tight flex items-center">
            <User className="mr-3" size={22} />
            Patient Profile
          </h3>
        </div>
        
        <div className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="relative mb-6 md:mb-0 md:mr-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full h-28 w-28 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {getInitials(patientInfo.name)}
              </div>
              <div className={`absolute bottom-0 right-0 rounded-full px-3 py-1 text-xs font-medium ${getGenderColor(patientInfo.gender)}`}>
                {patientInfo.gender}
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{patientInfo.name}</h2>
              <p className="text-blue-600 mb-4">Patient ID: {data.id || 'Unknown'}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <DataItem 
                  icon={<Calendar className="text-blue-500" size={18} />}
                  label="Date of Birth"
                  value={patientInfo.dob}
                />
                
                <DataItem 
                  icon={<Clock className="text-green-500" size={18} />}
                  label="Age"
                  value={patientInfo.age}
                />
                
                <DataItem 
                  icon={<Phone className="text-indigo-500" size={18} />}
                  label="Contact"
                  value={patientInfo.contactNumber}
                />
                
                <DataItem 
                  icon={<Mail className="text-red-500" size={18} />}
                  label="Email"
                  value={patientInfo.email}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-100">
            <DataItem 
              icon={<MapPin className="text-red-500" size={18} />}
              label="Address"
              value={patientInfo.address}
              fullWidth
            />
          </div>
        </div>
      </div>
      
      {/* Medical Information Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 px-8 py-6">
          <h3 className="font-semibold text-xl text-white tracking-tight flex items-center">
            <Activity className="mr-3" size={22} />
            Medical Summary
          </h3>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MedicalCard 
              title="Vital Signs"
              icon={<Gauge className="text-blue-500" size={20} />}
              bgColor="bg-blue-50"
              borderColor="border-blue-200"
              textColor="text-blue-800"
              items={[
                { label: "Blood Pressure", value: medicalInfo.bloodPressure, icon: <Activity size={16} className="text-blue-500" /> },
                { label: "Heart Rate", value: medicalInfo.heartRate, icon: <Heart size={16} className="text-red-500" /> }
              ]}
            />
            
            <MedicalCard 
              title="Body Metrics"
              icon={<BarChart className="text-green-500" size={20} />}
              bgColor="bg-green-50"
              borderColor="border-green-200"
              textColor="text-green-800"
              items={[
                { label: "Height", value: medicalInfo.height, icon: <Ruler size={16} className="text-green-500" /> },
                { label: "Weight", value: medicalInfo.weight, icon: <Weight size={16} className="text-green-500" /> },
                { label: "BMI", value: medicalInfo.bmi, icon: <Info size={16} className="text-blue-500" /> }
              ]}
            />
            
            <MedicalCard 
              title="Blood Information"
              icon={<Heart className="text-red-500" size={20} />}
              bgColor="bg-red-50"
              borderColor="border-red-200"
              textColor="text-red-800"
              items={[
                { label: "Blood Type", value: medicalInfo.bloodType, icon: <Heart size={16} className="text-red-500" /> }
              ]}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ListCard 
              title="Medical Conditions"
              icon={<Clipboard className="text-blue-500" size={18} />}
              items={medicalInfo.conditions}
              emptyText="No conditions listed"
              itemIcon={<Activity size={14} className="text-blue-500" />}
            />
            
            <ListCard 
              title="Allergies"
              icon={<AlertTriangle className="text-yellow-500" size={18} />}
              items={medicalInfo.allergies}
              emptyText="No allergies listed"
              itemIcon={<AlertCircle size={14} className="text-yellow-500" />}
            />
            
            <ListCard 
              title="Medications"
              icon={<Pill className="text-purple-500" size={18} />}
              items={medicalInfo.medications}
              emptyText="No medications listed"
              itemIcon={<Pill size={14} className="text-purple-500" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for basic data items
const DataItem = ({ icon, label, value, fullWidth = false }: { icon: React.ReactNode, label: string, value: string, fullWidth?: boolean }) => (
  <div className={`flex items-start ${fullWidth ? 'col-span-full' : ''}`}>
    <div className="mt-1 mr-3">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  </div>
);

// Component for medical cards
const MedicalCard = ({ 
  title, 
  icon, 
  bgColor, 
  borderColor, 
  textColor, 
  items 
}: { 
  title: string, 
  icon: React.ReactNode, 
  bgColor: string, 
  borderColor: string, 
  textColor: string, 
  items: { label: string, value: string, icon: React.ReactNode }[] 
}) => (
  <div className={`${bgColor} p-5 rounded-xl border ${borderColor} shadow-sm`}>
    <div className="flex items-center mb-4">
      {icon}
      <h4 className={`font-semibold ${textColor} ml-2`}>{title}</h4>
    </div>
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex items-start">
          <div className="mt-1 mr-2">{item.icon}</div>
          <div>
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="font-medium text-gray-800">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Component for list cards
const ListCard = ({ 
  title, 
  icon, 
  items, 
  emptyText,
  itemIcon
}: { 
  title: string, 
  icon: React.ReactNode, 
  items: string[], 
  emptyText: string,
  itemIcon: React.ReactNode
}) => (
  <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center mb-4 pb-2 border-b">
      {icon}
      <h4 className="font-semibold text-gray-800 ml-2">{title}</h4>
    </div>
    
    {items.length > 0 ? (
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex">
            <span className="mr-2 mt-1">{itemIcon}</span>
            <span className="text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    ) : (
      <div className="text-center py-4">
        <Shield size={24} className="text-gray-300 mx-auto mb-2" />
        <p className="text-gray-500 italic text-sm">{emptyText}</p>
      </div>
    )}
  </div>
);