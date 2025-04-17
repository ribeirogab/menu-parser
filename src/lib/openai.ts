import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: 'YOUR_API_KEY',
  dangerouslyAllowBrowser: true,
});
