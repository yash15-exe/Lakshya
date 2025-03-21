"use client";

import { useState } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { format } from "date-fns"; // Add this import for date formatting

// Custom Button component
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
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4",
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Custom Input component
const Input = ({ 
  className, 
  ...props 
}: HTMLMotionProps<"input"> & {
  className?: string;
}) => {
  return (
    <motion.input
      whileTap={{ scale: 1.01 }} // Changed from whileFocus to whileTap
      whileHover={{ scale: 1.01 }} // Added hover effect instead
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
};

// Custom Label component
// Add proper type definitions for the Label component
const Label = ({ 
  className, 
  ...props 
}: React.LabelHTMLAttributes<HTMLLabelElement> & {
  className?: string;
}) => {
  return (
    <label
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
};

// Custom Card components
// Add proper type definitions for the Card component
const Card = ({ 
  className, 
  ...props 
}: HTMLMotionProps<"div"> & {
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  );
};

// Add proper type definitions for the CardHeader component
const CardHeader = ({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
}) => {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  );
};

// Add proper type definitions for the CardTitle component
const CardTitle = ({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLHeadingElement> & {
  className?: string;
}) => {
  return (
    <h3
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  );
};

// Add proper type definitions for the CardContent component
const CardContent = ({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
}) => {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
};

// Custom Select component
// Add proper type definitions for the Select component
const Select = ({ 
  children, 
  className, 
  ...props 
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="relative">
      <select
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

// Custom Radio components
// Add proper type definitions for the RadioGroup component
const RadioGroup = ({ 
  className, 
  children, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={cn("flex", className)} {...props}>
      {children}
    </div>
  );
};

// Add proper type definitions for the RadioItem component
const RadioItem = ({ 
  id, 
  value, 
  label, 
  ...props 
}: React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  value: string;
  label: string;
}) => {
  return (
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
};

// Custom DatePicker component
// Add proper type definitions for the DatePicker component
// Update the DatePicker component to use a calendar popup
const DatePicker = ({ 
  value, 
  onChange 
}: {
  value: Date | undefined;
  onChange: (date: Date) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 99 + i);
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
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
            
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-emerald-600 py-1">
                  {day}
                </div>
              ))}
              
              {/* Calendar Days */}
              {Array.from({ length: getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth()) }, (_, i) => {
                const day = i + 1;
                const currentDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
                
                return (
                  <div 
                    key={day}
                    onClick={() => {
                      onChange(new Date(currentDate));
                      setIsOpen(false);
                    }}
                    className={`text-center py-1 text-sm rounded-md cursor-pointer hover:bg-emerald-50 ${
                      value && 
                      value.getDate() === day && 
                      value.getMonth() === viewDate.getMonth() && 
                      value.getFullYear() === viewDate.getFullYear() 
                        ? "bg-emerald-100 text-emerald-700" 
                        : ""
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

// Add a PDF upload component
const PdfUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleUpload = () => {
    if (!file) return;
    
    setIsLoading(true);
    
    // Simulate PDF processing
    setTimeout(() => {
      setSummary("This document appears to be a medical history report containing information about previous treatments, medications, and diagnoses. Key points include regular check-ups, normal blood pressure readings, and recommendations for maintaining a healthy lifestyle.");
      setIsLoading(false);
    }, 2000);
  };
  
  return (
    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100">
      <h3 className="text-lg font-medium text-emerald-800 mb-3">Upload Medical Documents</h3>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <label className="flex-1 flex flex-col items-center px-4 py-6 bg-white text-emerald-500 rounded-lg border border-dashed border-emerald-300 cursor-pointer hover:bg-green-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="mt-2 text-sm text-emerald-600">Select PDF file</span>
          <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
        </label>
        
        <Button
          onClick={handleUpload}
          disabled={!file || isLoading}
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
            "Scan Document"
          )}
        </Button>
      </div>
      
      {file && (
        <div className="mt-3 text-sm text-emerald-700">
          Selected: {file.name}
        </div>
      )}
      
      {summary && (
        <div className="mt-4 p-3 bg-white rounded-md border border-emerald-200">
          <h4 className="font-medium text-emerald-800 mb-2">Document Summary</h4>
          <p className="text-sm text-gray-700">{summary}</p>
        </div>
      )}
    </div>
  );
};

export default function RegistrationForm() {
  const [date, setDate] = useState<Date | undefined>();
  const [bloodGroup, setBloodGroup] = useState("");
  const [gender, setGender] = useState("male");

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
            Registration Form
          </CardTitle>
          <p className="text-center text-emerald-600 mt-1 text-sm sm:text-base">Please fill in your details below</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            {/* Full Name Section */}
            <div className="space-y-4 bg-green-50 p-3 sm:p-4 rounded-lg border border-green-100">
              <h3 className="text-base sm:text-lg font-medium text-emerald-800 flex items-center">
                <span className="h-5 sm:h-6 w-5 sm:w-6 rounded-full bg-emerald-100 text-emerald-600 mr-2 flex items-center justify-center text-xs sm:text-sm">1</span>
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="firstName" className="text-emerald-700 text-sm">First Name</Label>
                  <Input id="firstName" placeholder="Enter first name" className="border-emerald-200 focus:border-emerald-500" />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="middleName" className="text-emerald-700 text-sm">Middle Name</Label>
                  <Input id="middleName" placeholder="Enter middle name" className="border-emerald-200 focus:border-emerald-500" />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="lastName" className="text-emerald-700 text-sm">Last Name</Label>
                  <Input id="lastName" placeholder="Enter last name" className="border-emerald-200 focus:border-emerald-500" />
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
              <RadioGroup className="space-x-4" value={gender} onChange={(e) => setGender(e.target.value)}>
                <RadioItem id="male" value="male" label="Male" checked={gender === "male"} />
                <RadioItem id="female" value="female" label="Female" checked={gender === "female"} />
                <RadioItem id="other" value="other" label="Other" checked={gender === "other"} />
              </RadioGroup>
            </div>

            {/* PDF Uploader */}
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