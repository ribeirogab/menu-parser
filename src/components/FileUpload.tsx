import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { ImageInput } from '@/services/menu-analyzer';

type FileUploadProps = {
  onFilesChange: (files: File[]) => void;
  onImageInputsChange?: (imageInputs: ImageInput[]) => void;
};

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFilesChange, 
  onImageInputsChange 
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const convertToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove the prefix (e.g., 'data:image/jpeg;base64,') to get just the base64 string
          const base64String = reader.result;
          resolve(base64String);
        } else {
          reject(new Error('Falha ao converter arquivo para base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  const processFiles = async (fileList: File[]) => {
    // Update the files state for display purposes
    setFiles(fileList);
    onFilesChange(fileList);
    
    // If the parent component wants image inputs, convert files to base64
    if (onImageInputsChange) {
      try {
        const imageInputs: ImageInput[] = await Promise.all(
          fileList.map(async (file) => {
            const base64 = await convertToBase64(file);
            return {
              type: 'base64',
              data: base64
            };
          })
        );
        onImageInputsChange(imageInputs);
      } catch (error) {
        console.error('Erro ao converter arquivos para base64:', error);
      }
    }
  };

  const handleFileChange = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    
    const fileArray = Array.from(newFiles);
    const imageFiles = fileArray.filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );
    
    processFiles([...files, ...imageFiles]);
  }, [files]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [handleFileChange]);

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    processFiles(newFiles);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-8 w-8 text-gray-400" />
          <h3 className="text-lg font-medium">Arraste e solte suas imagens de cardápio</h3>
          <p className="text-sm text-gray-500">ou clique para selecionar arquivos</p>
          
          <input
            type="file"
            multiple
            accept="image/*,application/pdf"
            className="hidden"
            id="file-upload"
            onChange={(e) => handleFileChange(e.target.files)}
          />
          
          <label htmlFor="file-upload">
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <span>Selecionar Arquivos</span>
            </Button>
          </label>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Arquivos Selecionados</h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
              >
                <div className="flex items-center space-x-2 truncate">
                  <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Prévia"
                        className="w-8 h-8 object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-xs">PDF</span>
                    )}
                  </div>
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
