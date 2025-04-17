import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/FileUpload';
import UrlInput from '@/components/UrlInput';
import JsonModal from '@/components/JsonModal';
import { ImageDown, Loader2 } from 'lucide-react';
import {
  menuAnalyzer,
  MenuAnalysisResult,
  ImageInput,
} from '@/services/menu-analyzer';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageInputs, setImageInputs] = useState<ImageInput[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jsonContent, setJsonContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inputMethod, setInputMethod] = useState<'upload' | 'url'>('upload');

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleUrlsChange = (urls: string[]) => {
    setImageUrls(urls);
  };

  const handleImageInputsChange = (inputs: ImageInput[]) => {
    setImageInputs(inputs);
  };

  const handleGenerateJson = async () => {
    setIsLoading(true);
    try {
      // Verificar se há imagens para analisar
      if (imageInputs.length === 0) {
        toast.error('Por favor, adicione pelo menos uma imagem ou URL');
        setIsLoading(false);
        return;
      }

      const result: MenuAnalysisResult = await menuAnalyzer(imageInputs);

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
            Upload menu images or provide URLs and generate JSON for your
            digital menu system
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <Tabs
            defaultValue="upload"
            className="mb-6"
            onValueChange={(value) => setInputMethod(value as 'upload' | 'url')}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload Files</TabsTrigger>
              <TabsTrigger value="url">Enter URLs</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="mt-4">
              <FileUpload
                onFilesChange={handleFilesChange}
                onImageInputsChange={handleImageInputsChange}
              />
            </TabsContent>
            <TabsContent value="url" className="mt-4">
              <UrlInput
                onUrlsChange={handleUrlsChange}
                onImageInputsChange={handleImageInputsChange}
              />
            </TabsContent>
          </Tabs>

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
          {inputMethod === 'upload' ? (
            files.length > 0 ? (
              <p>{files.length} file(s) ready for processing</p>
            ) : (
              <div>
                <p className="mb-2">
                  Upload one or more menu images to get started
                </p>
              </div>
            )
          ) : imageUrls.length > 0 ? (
            <p>{imageUrls.length} URL(s) ready for analysis</p>
          ) : (
            <div>
              <p className="mb-2">
                Enter one or more menu image URLs to get started
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
