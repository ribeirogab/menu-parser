import OpenAI from 'openai';

// Function to get the API key from environment variables or local storage
const getApiKey = (): string => {
  // First try to get from environment variable (for production builds)
  const envApiKey = import.meta.env.VITE_OPENAI_API_KEY;

  // Then try to get from localStorage (for development)
  const localStorageApiKey = localStorage.getItem('openai_api_key');

  // Return the first available key or empty string
  return envApiKey || localStorageApiKey || '';
};

export const openai = new OpenAI({
  apiKey: getApiKey(),
  dangerouslyAllowBrowser: true,
});

// Function to set API key in localStorage
export const setApiKey = (key: string): void => {
  localStorage.setItem('openai_api_key', key);
  // Force reload to reinitialize the OpenAI client with the new key
  window.location.reload();
};

// Function to remove API key from localStorage
export const removeApiKey = (): void => {
  localStorage.removeItem('openai_api_key');
  // Force reload to reinitialize the OpenAI client without the key
  window.location.reload();
};

// Function to check if API key is set
export const hasApiKey = (): boolean => {
  return Boolean(getApiKey());
};
