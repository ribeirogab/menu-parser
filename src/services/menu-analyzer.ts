import { openai } from '../lib/openai';

// Define a estrutura para um item do cardápio
export interface MenuItem {
  dish_name: string;
  description: string;
  price: string;
  category: string;
}

// Define a estrutura para o resultado completo da análise do cardápio
export interface MenuAnalysisResult {
  items: MenuItem[];
  error?: string;
}

// Define a estrutura para entrada de imagem
export interface ImageInput {
  type: 'url' | 'base64';
  data: string;
}

/**
 * Analisa imagens de cardápios e extrai dados estruturados
 * @param images Array de entradas de imagens (URLs ou imagens codificadas em base64) de cardápios de restaurantes
 * @returns Dados estruturados do cardápio com itens categorizados
 */
export async function menuAnalyzer(
  images: ImageInput[]
): Promise<MenuAnalysisResult> {
  try {
    const formattedImages = images.map((image) => {
      if (image.type === 'url') {
        return {
          type: 'image_url' as const,
          image_url: { url: image.data },
        };
      } else {
        // Para imagens base64, o formato já está correto
        return {
          type: 'image_url' as const,
          image_url: { url: image.data },
        };
      }
    });

    const systemPrompt = `
      Você é um assistente especializado em analisar cardápios de restaurantes.
      Analise as imagens de cardápio fornecidas e extraia as seguintes informações:
      
      1. Nome de cada prato
      2. Descrição (se disponível)
      3. Preço
      4. Categoria (ex: entradas, pratos principais, bebidas, sobremesas)
      
      Formate a saída como um array JSON com a seguinte estrutura para cada item:
      {{
        "dish_name": "Nome do prato",
        "description": "Descrição do prato",
        "price": "R$ XX,XX",
        "category": "Categoria do prato"
      }}
      
      Notas importantes:
      - Mantenha todos os textos em Português BR
      - Se não houver descrição, use uma string vazia
      - Mantenha o formato original do preço (ex: R$ 10,90)
      - Categorize corretamente os itens com base no contexto do cardápio
      - Inclua TODOS os itens visíveis nas imagens
      - Não invente informações que não estejam presentes nas imagens
      - Retorne APENAS o array JSON, sem texto adicional ou explicações
    `;

    // Faz a requisição para a API da OpenAI
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
              text: 'Analise este cardápio e extraia os dados estruturados conforme solicitado:',
            },
            ...formattedImages,
          ],
        },
      ],
      max_tokens: 4096,
      temperature: 0.2, // Temperatura mais baixa para resultados mais determinísticos
    });

    // Extrai e analisa a resposta
    const content = response.choices[0]?.message?.content || '';
    
    try {
      // Limpa o conteúdo removendo blocos de código markdown e texto extra
      const jsonStr = content.replace(/```json\n|```\n|```/g, '').trim();
      
      // Analisa a string JSON em um array de itens de cardápio
      const items = JSON.parse(jsonStr) as MenuItem[];
      
      return { items };
    } catch (parseError) {
      console.error('Erro ao analisar resposta da OpenAI:', parseError);
      return {
        items: [],
        error:
          'Falha ao processar a resposta do modelo. O formato retornado não é um JSON válido.',
      };
    }
  } catch (error) {
    console.error('Erro ao chamar a API da OpenAI:', error);
    return {
      items: [],
      error: `Falha ao analisar o cardápio: ${error.message}`,
    };
  }
}
