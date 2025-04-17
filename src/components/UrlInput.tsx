import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { ImageInput } from '@/services/menu-analyzer';

type UrlInputProps = {
  onUrlsChange: (urls: string[]) => void;
  onImageInputsChange?: (imageInputs: ImageInput[]) => void;
};

const UrlInput: React.FC<UrlInputProps> = ({ onUrlsChange, onImageInputsChange }) => {
  const [urls, setUrls] = useState<string[]>(['']);
  const [error, setError] = useState<string | null>(null);

  const validateUrl = (url: string): boolean => {
    if (!url) return true; // Empty is allowed, will be filtered out later
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const processUrls = (newUrls: string[]) => {
    setUrls(newUrls);
    
    // Validate URL format
    const hasInvalidUrl = newUrls.some(url => url && !validateUrl(url));
    if (hasInvalidUrl) {
      setError('Please enter a valid URL');
    } else {
      setError(null);
    }
    
    // Filter valid URLs
    const validUrls = newUrls.filter(url => url && validateUrl(url));
    
    // Notify parent component of valid URLs
    onUrlsChange(validUrls);
    
    // If parent wants ImageInput objects, convert URLs to that format
    if (onImageInputsChange) {
      const imageInputs: ImageInput[] = validUrls.map(url => ({
        type: 'url',
        data: url
      }));
      onImageInputsChange(imageInputs);
    }
  };

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    processUrls(newUrls);
  };

  const addUrlField = () => {
    processUrls([...urls, '']);
  };

  const removeUrlField = (index: number) => {
    if (urls.length <= 1) return;
    
    const newUrls = urls.filter((_, i) => i !== index);
    processUrls(newUrls);
  };

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium mb-2">Enter image URLs</div>
      
      {urls.map((url, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            type="url"
            value={url}
            onChange={(e) => handleUrlChange(index, e.target.value)}
            placeholder="https://example.com/menu-image.jpg"
            className="flex-1"
          />
          {urls.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeUrlField(index)}
              className="h-10 w-10"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      
      {error && <p className="text-sm text-red-500">{error}</p>}
      
      <Button
        variant="outline"
        size="sm"
        onClick={addUrlField}
        className="mt-2"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add another URL
      </Button>
      
      <div className="text-xs text-gray-500 mt-2">
        Enter URLs of publicly accessible menu images (JPEG, PNG, WebP, GIF)
      </div>
    </div>
  );
};

export default UrlInput;
