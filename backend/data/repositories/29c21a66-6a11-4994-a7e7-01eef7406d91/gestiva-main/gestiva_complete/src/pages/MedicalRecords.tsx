
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Download, Upload, Eye, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MedicalRecords = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const medicalRecords = [
    {
      id: 1,
      name: "Blood Test Report - Dec 2024",
      date: "2024-12-15",
      type: "Lab Report",
      size: "2.3 MB",
      doctor: "Dr. Priya Sharma"
    },
    {
      id: 2,
      name: "Ultrasound Images - Nov 2024",
      date: "2024-11-20",
      type: "Imaging",
      size: "5.1 MB",
      doctor: "Dr. Kavita Patel"
    },
    {
      id: 3,
      name: "Prescription - Prenatal Vitamins",
      date: "2024-11-15",
      type: "Prescription",
      size: "0.8 MB",
      doctor: "Dr. Priya Sharma"
    },
    {
      id: 4,
      name: "Glucose Tolerance Test",
      date: "2024-10-30",
      type: "Lab Report",
      size: "1.5 MB",
      doctor: "Dr. Anita Gupta"
    },
    {
      id: 5,
      name: "First Trimester Screening",
      date: "2024-09-25",
      type: "Test Report",
      size: "3.2 MB",
      doctor: "Dr. Kavita Patel"
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded successfully`,
      });
    }
  };

  const handleDownload = (record: any) => {
    toast({
      title: "Downloading",
      description: `Downloading ${record.name}`,
    });
  };

  const handleView = (record: any) => {
    toast({
      title: "Opening Document",
      description: `Opening ${record.name}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gestiva-light/20 to-gestiva-medium/30 p-6">
      <div 
        className="fixed inset-0 opacity-5 bg-contain bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url('/lovable-uploads/4b7c60ef-3ac8-4f9e-919a-6ebe93120366.png')`,
        }}
      />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/dashboard">
            <Button variant="outline" className="mr-4 border-gestiva-medium text-gestiva-medium hover:bg-gestiva-medium hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gestiva-darkest">Medical Records</h1>
        </div>

        {/* Upload Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 animate-fade-in">
          <h2 className="text-xl font-bold text-gestiva-darkest mb-4 flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Upload New Document
          </h2>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="flex-1 p-3 border border-gestiva-light rounded-lg focus:border-gestiva-medium"
            />
            <Button className="bg-gestiva-medium hover:bg-gestiva-dark text-white">
              Upload
            </Button>
          </div>
          {selectedFile && (
            <p className="text-gestiva-medium text-sm mt-2">
              ✓ Selected: {selectedFile.name}
            </p>
          )}
        </div>

        {/* Records List */}
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-2xl font-bold text-gestiva-darkest">Your Medical Documents</h2>
          
          {medicalRecords.map((record, index) => (
            <Card key={record.id} className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gestiva-light/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-gestiva-medium" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gestiva-darkest">{record.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gestiva-dark mt-1">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {record.date}
                        </span>
                        <span className="bg-gestiva-light/20 px-2 py-1 rounded">
                          {record.type}
                        </span>
                        <span>{record.size}</span>
                      </div>
                      <p className="text-gestiva-dark text-sm mt-1">
                        Uploaded by: {record.doctor}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(record)}
                      className="border-gestiva-medium text-gestiva-medium hover:bg-gestiva-medium hover:text-white"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(record)}
                      className="border-gestiva-medium text-gestiva-medium hover:bg-gestiva-medium hover:text-white"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Records Summary */}
        <div className="mt-8 grid md:grid-cols-3 gap-6 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-gestiva-medium mb-2">5</div>
            <div className="text-gestiva-dark">Total Documents</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-gestiva-medium mb-2">3</div>
            <div className="text-gestiva-dark">Lab Reports</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-gestiva-medium mb-2">12.9</div>
            <div className="text-gestiva-dark">Total MB</div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-gestiva-light/20 rounded-2xl p-6 animate-fade-in">
          <h3 className="text-lg font-bold text-gestiva-darkest mb-3">Document Management Tips</h3>
          <ul className="text-gestiva-dark space-y-2">
            <li>• Keep all pregnancy-related documents organized in one place</li>
            <li>• Upload reports immediately after receiving them</li>
            <li>• Share important documents with your healthcare team</li>
            <li>• Backup critical documents in cloud storage</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;
