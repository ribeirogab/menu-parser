import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/FileUpload';
import UrlInput from '@/components/UrlInput';
import JsonModal from '@/components/JsonModal';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { ImageDown, Loader2 } from 'lucide-react';
import {
  menuAnalyzer,
  MenuAnalysisResult,
  ImageInput,
} from '@/services/menu-analyzer';
import { hasApiKey } from '@/lib/openai';
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
  const [isApiKeySet, setIsApiKeySet] = useState(false);

  // Check if API key is set on component mount and when it changes
  useEffect(() => {
    setIsApiKeySet(hasApiKey());
  }, []);

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
    // Verificar se a chave da API está configurada
    if (!hasApiKey()) {
      toast.error('Por favor, configure sua chave da API OpenAI primeiro');
      return;
    }

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
      toast.error('Falha ao gerar JSON do cardápio');
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
            Analisador de Cardápios
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Faça upload de imagens de cardápios ou forneça URLs e gere JSON estruturado para seu sistema
          </p>
        </div>

        {/* API Key Input Component */}
        <ApiKeyInput />

        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <Tabs
            defaultValue="upload"
            className="mb-6"
            onValueChange={(value) => setInputMethod(value as 'upload' | 'url')}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload de Arquivos</TabsTrigger>
              <TabsTrigger value="url">Inserir URLs</TabsTrigger>
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
              disabled={isLoading || !hasApiKey()}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analisando Cardápio...
                </>
              ) : (
                <>
                  <ImageDown className="w-5 h-5" />
                  Gerar JSON do Cardápio
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          {inputMethod === 'upload' ? (
            files.length > 0 ? (
              <p>{files.length} arquivo(s) pronto(s) para processamento</p>
            ) : (
              <div>
                <p className="mb-2">
                  Faça upload de uma ou mais imagens de cardápio para começar
                </p>
              </div>
            )
          ) : imageUrls.length > 0 ? (
            <p>{imageUrls.length} URL(s) pronto(s) para análise</p>
          ) : (
            <div>
              <p className="mb-2">
                Insira uma ou mais URLs de imagens de cardápio para começar
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
