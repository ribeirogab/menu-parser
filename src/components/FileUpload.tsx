
import React, { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";

type FileUploadProps = {
  onFilesChange: (files: File[]) => void;
};

const FileUpload: React.FC<FileUploadProps> = ({ onFilesChange }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    
    const fileArray = Array.from(newFiles);
    const imageFiles = fileArray.filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );
    
    setFiles(prevFiles => {
      const updatedFiles = [...prevFiles, ...imageFiles];
      onFilesChange(updatedFiles);
      return updatedFiles;
    });
  }, [onFilesChange]);

  const removeFile = useCallback((index: number) => {
    setFiles(prevFiles => {
      const updatedFiles = prevFiles.filter((_, i) => i !== index);
      onFilesChange(updatedFiles);
      return updatedFiles;
    });
  }, [onFilesChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [handleFileChange]);

  return (
    <div className="w-full space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="w-10 h-10 text-gray-400" />
          <p className="text-lg font-medium">Drag & drop menu images here</p>
          <p className="text-sm text-gray-500">Supported formats: PNG, JPEG, PDF</p>
          <Button 
            variant="outline" 
            size="sm"
            className="mt-2"
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById("file-input")?.click();
            }}
          >
            Browse files
          </Button>
          <input
            id="file-input"
            type="file"
            multiple
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files)}
          />
        </div>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {files.map((file, index) => (
            <Card key={`${file.name}-${index}`} className="overflow-hidden">
              <CardContent className="p-2 relative">
                <div className="aspect-[4/3] relative bg-gray-100 rounded overflow-hidden">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="object-cover w-full h-full"
                      onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-200">
                      <p className="text-sm font-medium">PDF Document</p>
                    </div>
                  )}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs truncate mt-2">{file.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
