"use client";

import { useState } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Base UI Components with consistent styling patterns
const Button = ({ 
  children, 
  className = "", 
  variant = "default", 
  ...props 
}: HTMLMotionProps<"button"> & {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
}) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 py-2 px-4",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Simplified form components with consistent styling
const FormField = ({ label, children, icon }: { label: string; children: React.ReactNode; icon?: React.ReactNode }) => (
  <div className="space-y-1 sm:space-y-2">
    <Label className="text-emerald-700 text-sm flex items-center">
      {icon && (
        <span className="h-4 sm:h-5 w-4 sm:w-5 rounded-full bg-emerald-100 text-emerald-600 mr-2 flex items-center justify-center text-xs">
          {icon}
        </span>
      )}
      {label}
    </Label>
    {children}
  </div>
);

const Input = ({ className, ...props }: HTMLMotionProps<"input"> & { className?: string }) => (
  <motion.input
    whileTap={{ scale: 1.01 }}
    whileHover={{ scale: 1.01 }}
    className={cn(
      "flex h-10 w-full rounded-md border border-emerald-200 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
);

const Label = ({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement> & { className?: string }) => (
  <label
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
);

// Card components simplified
const Card = ({ className, ...props }: HTMLMotionProps<"div"> & { className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
    {...props}
  />
);

const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement> & { className?: string }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);

const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement> & { className?: string }) => (
  <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
);

const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement> & { className?: string }) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);

// Select component
const Select = ({ children, className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className="relative">
    <select
      className={cn(
        "flex h-10 w-full rounded-md border border-emerald-200 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  </div>
);

// Radio components
const RadioGroup = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children: React.ReactNode;
}) => (
  <div className={cn("flex", className)} {...props}>{children}</div>
);

const RadioItem = ({ id, value, label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  value: string;
  label: string;
}) => (
  <div className="flex items-center space-x-2">
    <input
      type="radio"
      id={id}
      value={value}
      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
      {...props}
    />
    <Label htmlFor={id}>{label}</Label>
  </div>
);

// DatePicker component
const DatePicker = ({ value, onChange }: { value: Date | undefined; onChange: (date: Date) => void; }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 99 + i);
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  
  return (
    <div className="relative">
      <div 
        className="flex h-10 w-full rounded-md border border-emerald-200 bg-background px-3 py-2 text-sm items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value ? format(value, "PPP") : "Select date"}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-auto text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 bg-white rounded-md shadow-lg p-2 border border-emerald-100 w-64">
          <div className="p-2">
            {/* Month and Year Selection */}
            <div className="flex justify-between items-center mb-2">
              <select 
                value={viewDate.getMonth()} 
                onChange={(e) => setViewDate(new Date(viewDate.getFullYear(), parseInt(e.target.value), 1))}
                className="text-sm border border-emerald-200 rounded-md p-1"
              >
                {months.map((month, index) => (
                  <option key={month} value={index}>{month}</option>
                ))}
              </select>
              
              <select 
                value={viewDate.getFullYear()} 
                onChange={(e) => setViewDate(new Date(parseInt(e.target.value), viewDate.getMonth(), 1))}
                className="text-sm border border-emerald-200 rounded-md p-1"
              >
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-emerald-600 py-1">{day}</div>
              ))}
              
              {Array.from({ length: getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth()) }, (_, i) => {
                const day = i + 1;
                const currentDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
                const isSelected = value && 
                  value.getDate() === day && 
                  value.getMonth() === viewDate.getMonth() && 
                  value.getFullYear() === viewDate.getFullYear();
                
                return (
                  <div 
                    key={day}
                    onClick={() => {
                      onChange(new Date(currentDate));
                      setIsOpen(false);
                    }}
                    className={`text-center py-1 text-sm rounded-md cursor-pointer hover:bg-emerald-50 ${
                      isSelected ? "bg-emerald-100 text-emerald-700" : ""
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Updated PDF uploader component with API connection and data display
const PdfUploader = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState<any>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };
  
  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select at least one PDF file.");
      return;
    }
    setIsLoading(true);
    
    try {
      // Create FormData to send multiple files
      const formData = new FormData();
      files.forEach(file => {
        formData.append('document', file);
      });
      
      // Make API call to backend server
      const response = await fetch('https://healthbot.pythonanywhere.com/api/upload-report/', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to process the documents");
      }
      
      const data = await response.json();
      setResponseData(JSON.parse(data.summary));
      alert("Documents uploaded successfully!");
    } catch (error: any) {
      console.error('Error uploading PDFs:', error);
      alert(error.message || "Error processing documents. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Recursive function to render nested data in a table
  const renderDataSummary = (data: any) => {
    if (typeof data === "object" && !Array.isArray(data)) {
      return (
        <div className="border border-emerald-200 rounded-md">
          <table className="w-full">
            <tbody>
              {Object.entries(data).map(([key, value]) => (
                <tr key={key} className="border-b border-emerald-100 last:border-0">
                  <td className="p-2 font-medium text-emerald-700">{key}</td>
                  <td className="p-2">{renderDataSummary(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (Array.isArray(data)) {
      return (
        <ul className="list-disc list-inside text-sm">
          {data.map((item, index) => (
            <li key={index} className="mb-1">{renderDataSummary(item)}</li>
          ))}
        </ul>
      );
    } else {
      return <span className="text-sm">{data}</span>;
    }
  };
  
  return (
    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100">
      <h3 className="text-lg font-medium text-emerald-800 mb-3">Upload Medical Documents</h3>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <label className="flex-1 flex flex-col items-center px-4 py-6 bg-white text-emerald-500 rounded-lg border border-dashed border-emerald-300 cursor-pointer hover:bg-green-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="mt-2 text-sm text-emerald-600">Select PDF files</span>
          <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} multiple />
        </label>
        
        <Button
          onClick={handleUpload}
          disabled={files.length === 0 || isLoading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Scan Documents"
          )}
        </Button>
      </div>
      
      {files.length > 0 && (
        <div className="mt-3">
          <h4 className="text-sm font-medium text-emerald-700 mb-1">Selected Files:</h4>
          <ul className="text-sm text-emerald-600 list-disc list-inside">
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
      
      {responseData && (
        <div className="mt-4 p-3 bg-white rounded-md border border-emerald-200">
          <h4 className="font-medium text-emerald-800 mb-2">Document Summary</h4>
          {renderDataSummary(responseData)}
        </div>
      )}
    </div>
  );
};

// Main component
export default function RegistrationForm() {
  const [date, setDate] = useState<Date | undefined>();
  const [bloodGroup, setBloodGroup] = useState("");
  const [gender, setGender] = useState("male");
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: "",
      middleName: "",
      lastName: "",
      bloodGroup: "",
      gender: "male",
    }
  });

  // Handle form submission for entire registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine all form data
    const completeFormData = {
      ...formData,
      personalInfo: {
        ...formData.personalInfo,
        dob: date,
        bloodGroup: bloodGroup,
        gender: gender
      }
    };
    
    // Here you would typically send this data to your backend
    try {
      alert("Registration data ready to be saved!");
      console.log("Form data:", completeFormData);
      
      // TODO: Add Firebase or other database integration similar to second example
      // const response = await fetch('your-api-endpoint', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(completeFormData),
      // });
      
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-200 to-teal-100 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-2xl mx-auto backdrop-blur-sm bg-white/90 border-none shadow-xl">
        <CardHeader className="pb-4">
          <div className="w-full flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-center text-emerald-800">
            Medical Registration Form
          </CardTitle>
          <p className="text-center text-emerald-600 mt-1 text-sm sm:text-base">Please fill in your details below</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Full Name Section */}
            <div className="space-y-4 bg-green-50 p-3 sm:p-4 rounded-lg border border-green-100">
              <h3 className="text-base sm:text-lg font-medium text-emerald-800 flex items-center">
                <span className="h-5 sm:h-6 w-5 sm:w-6 rounded-full bg-emerald-100 text-emerald-600 mr-2 flex items-center justify-center text-xs sm:text-sm">1</span>
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="firstName" className="text-emerald-700 text-sm">First Name</Label>
                  <Input 
                    id="firstName" 
                    placeholder="Enter first name" 
                    className="border-emerald-200 focus:border-emerald-500" 
                    value={formData.personalInfo.firstName}
                    onChange={(e) => setFormData({
                      ...formData,
                      personalInfo: { ...formData.personalInfo, firstName: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="middleName" className="text-emerald-700 text-sm">Middle Name</Label>
                  <Input 
                    id="middleName" 
                    placeholder="Enter middle name" 
                    className="border-emerald-200 focus:border-emerald-500" 
                    value={formData.personalInfo.middleName}
                    onChange={(e) => setFormData({
                      ...formData,
                      personalInfo: { ...formData.personalInfo, middleName: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="lastName" className="text-emerald-700 text-sm">Last Name</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Enter last name" 
                    className="border-emerald-200 focus:border-emerald-500" 
                    value={formData.personalInfo.lastName}
                    onChange={(e) => setFormData({
                      ...formData,
                      personalInfo: { ...formData.personalInfo, lastName: e.target.value }
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Blood Group & Date of Birth */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="bloodGroup" className="text-emerald-700 text-sm flex items-center">
                  <span className="h-4 sm:h-5 w-4 sm:w-5 rounded-full bg-red-100 text-emerald-600 mr-2 flex items-center justify-center text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-2 sm:h-3 w-2 sm:w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </span>
                  Blood Group
                </Label>
                <Select 
                  id="bloodGroup" 
                  value={bloodGroup} 
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="border-emerald-200 focus:border-emerald-500"
                >
                  <option value="" disabled>Select blood group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </Select>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="dob" className="text-emerald-700 text-sm flex items-center">
                  <span className="h-4 sm:h-5 w-4 sm:w-5 rounded-full bg-green-100 text-emerald-600 mr-2 flex items-center justify-center text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-2 sm:h-3 w-2 sm:w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                  Date of Birth
                </Label>
                <DatePicker value={date} onChange={setDate} />
              </div>
            </div>

            {/* Gender Selection */}
            <div className="space-y-2">
              <Label className="text-emerald-700 text-sm flex items-center">
                <span className="h-4 sm:h-5 w-4 sm:w-5 rounded-full bg-blue-100 text-emerald-600 mr-2 flex items-center justify-center text-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-2 sm:h-3 w-2 sm:w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                Gender
              </Label>
              <RadioGroup className="space-x-4" value={gender} onChange={(e: any) => setGender(e.target.value)}>
                <RadioItem id="male" value="male" label="Male" checked={gender === "male"} />
                <RadioItem id="female" value="female" label="Female" checked={gender === "female"} />
                <RadioItem id="other" value="other" label="Other" checked={gender === "other"} />
              </RadioGroup>
            </div>

            {/* PDF Uploader - Updated with API integration */}
            <PdfUploader />
            
            {/* Submit Button - Moved below PDF Uploader */}
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 sm:py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
              >
                Complete Registration
              </Button>
            </div>
            
            <p className="text-center text-emerald-600 text-xs sm:text-sm mt-4">
              By registering, you agree to our Terms of Service and Privacy Policy
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}