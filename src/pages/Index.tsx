
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import JsonModal from "@/components/JsonModal";
import { generateSampleMenuJson } from "@/utils/sampleJson";
import { ImageDown } from "lucide-react";

const Index = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jsonContent, setJsonContent] = useState("");

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleGenerateJson = () => {
    // Generate sample JSON (in a real app, this would process the images)
    const sampleJson = generateSampleMenuJson();
    setJsonContent(sampleJson);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Digital Menu Setup
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Upload menu images and generate JSON for your digital menu system
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <FileUpload onFilesChange={handleFilesChange} />

          <div className="mt-8 flex justify-center">
            <Button 
              size="lg"
              onClick={handleGenerateJson}
              disabled={files.length === 0}
              className="gap-2"
            >
              <ImageDown className="w-5 h-5" />
              Generate Menu JSON
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          {files.length > 0 ? (
            <p>{files.length} file(s) ready for processing</p>
          ) : (
            <p>Upload one or more menu images to get started</p>
          )}
        </div>

        <JsonModal 
          jsonContent={jsonContent}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      </div>
    </div>
  );
};

export default Index;
