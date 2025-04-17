import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/FileUpload';
import JsonModal from '@/components/JsonModal';
import { ImageDown, Loader2 } from 'lucide-react';
import { menuAnalyzer, MenuAnalysisResult } from '@/services/menu-analyzer';
import { toast } from 'sonner';

const Index = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jsonContent, setJsonContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Default image URL for testing
  const defaultImageUrl =
    'https://pub-d5a0dc827d5e4a52bffaede19ac19edb.r2.dev/12d9097a-0e09-406d-8834-ec292d6f1cbf.jpg';

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleGenerateJson = async () => {
    setIsLoading(true);
    try {
      // For now, we'll use the default image URL as specified in the requirements
      // In a real implementation, we would process the uploaded files
      const imageUrls = [defaultImageUrl];

      const result: MenuAnalysisResult = await menuAnalyzer(imageUrls);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      // Format the JSON for display
      const formattedJson = JSON.stringify(result.items, null, 2);
      setJsonContent(formattedJson);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error generating menu JSON:', error);
      toast.error('Failed to generate menu JSON');
    } finally {
      setIsLoading(false);
    }
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
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Menu...
                </>
              ) : (
                <>
                  <ImageDown className="w-5 h-5" />
                  Generate Menu JSON
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          {files.length > 0 ? (
            <p>{files.length} file(s) ready for processing</p>
          ) : (
            <div>
              <p className="mb-2">
                Upload one or more menu images to get started
              </p>
              <p className="text-xs text-blue-600">
                Note: Currently using a default menu image for demonstration
              </p>
            </div>
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
