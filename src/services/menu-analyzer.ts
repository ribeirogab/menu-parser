import { openai } from '../lib/openai';

// Define the structure for a menu item
export interface MenuItem {
  dish_name: string;
  description: string;
  price: string;
  category: string;
}

// Define the structure for the complete menu analysis result
export interface MenuAnalysisResult {
  items: MenuItem[];
  error?: string;
}

/**
 * Analyzes menu images and extracts structured data
 * @param imageUrls Array of URLs or base64 encoded images of restaurant menus
 * @returns Structured menu data with categorized items
 */
export async function menuAnalyzer(
  imageUrls: string[]
): Promise<MenuAnalysisResult> {
  try {
    const images = imageUrls.map((url) => ({
      type: 'image_url' as const,
      image_url: { url },
    }));

    const systemPrompt = `
      You are an assistant specialized in analyzing restaurant menus.
      Analyze the provided menu images and extract the following information:
      
      1. Name of each dish
      2. Description (if available)
      3. Price
      4. Category (e.g., starters, main courses, drinks, desserts)
      
      Format the output as a JSON array with the following structure for each item:
      {{
        "dish_name": "Name of the dish",
        "description": "Description of the dish",
        "price": "R$ XX,XX",
        "category": "Category of the dish"
      }}
      
      Important notes:
      - Keep all texts in Portuguese BR
      - If there is no description, use an empty string
      - Maintain the original price format (e.g., R$ 10,90)
      - Correctly categorize items based on the menu context
      - Include ALL items visible in the images
      - Do not invent information that is not present in the images
      - Return ONLY the JSON array, no additional text or explanations
    `;

    // Make the API request to OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this menu and extract structured data as requested:',
            },
            ...images,
          ],
        },
      ],
      max_tokens: 4096,
      temperature: 0.2, // Lower temperature for more deterministic results
    });

    // Extract and parse the response
    const content = response.choices[0]?.message?.content || '';
    
    try {
      // Clean the content by removing any markdown code blocks and extra text
      const jsonStr = content.replace(/```json\n|```\n|```/g, '').trim();
      
      // Parse the JSON string into an array of menu items
      const items = JSON.parse(jsonStr) as MenuItem[];
      
      return { items };
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      return {
        items: [],
        error:
          'Failed to process the model response. The returned format is not valid JSON.',
      };
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return {
      items: [],
      error: `Failed to analyze the menu: ${error.message}`,
    };
  }
}
