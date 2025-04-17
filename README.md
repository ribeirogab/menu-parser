# Menu Parser

## Tutorial de Instalação e Uso

### Pré-requisitos

- Node.js (versão 20 ou superior)
- npm
- Uma chave de API da OpenAI

### Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/ribeirogab/menu-parser.git
   cd menu-parser
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure a chave da API OpenAI:
   
   **Opção 1: Variável de ambiente (recomendado para produção)**
   
   Crie um arquivo `.env.local` na raiz do projeto e adicione sua chave:
   
   ```
   VITE_OPENAI_API_KEY=sua_chave_api_aqui
   ```
   
   **Opção 2: Interface do usuário (recomendado para desenvolvimento)**
   
   A aplicação agora possui uma interface para configurar a chave da API diretamente no navegador.
   Após iniciar o projeto, você poderá inserir sua chave na seção "Chave da API OpenAI" no topo da página.

### Executando o projeto

1. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

2. Acesse a aplicação em seu navegador:

   ```bash
   http://localhost:8080
   ```

### Como usar

1. **Configuração da chave API**:
   - Na parte superior da aplicação, clique em "Configurar chave" na seção "Chave da API OpenAI"
   - Insira sua chave de API da OpenAI no formato "sk-..."
   - Clique em "Salvar chave"
   - A chave será armazenada apenas no seu navegador local e não será enviada para nenhum servidor
   - Para remover a chave, clique no ícone de lixeira ao lado do botão "Alterar chave"

2. **Upload de imagens**:
   - Clique na aba "Upload de Arquivos"
   - Arraste e solte imagens de cardápios ou clique em "Select Files" para escolher arquivos
   - As imagens serão convertidas para base64 e enviadas para análise

3. **Inserção de URLs**:
   - Clique na aba "Inserir URLs"
   - Insira URLs de imagens de cardápios publicamente acessíveis
   - Adicione múltiplas URLs clicando em "Add another URL"

4. **Geração de JSON**:
   - Clique no botão "Gerar JSON do Cardápio"
   - A API da OpenAI analisará as imagens e extrairá as informações
   - O resultado será exibido em formato JSON estruturado
   - Você pode copiar o JSON gerado clicando no botão "Copy JSON"

### Estrutura do JSON gerado

O JSON gerado segue este formato:

```json
[
  {
    "dish_name": "Nome do prato",
    "description": "Descrição do prato (se disponível)",
    "price": "R$ XX,XX",
    "category": "Categoria do prato"
  },
  ...
]
```

### Notas

- Formatos de imagem suportados: JPEG, PNG, WebP, GIF
- As imagens são processadas diretamente no navegador, sem necessidade de upload para um servidor intermediário
- Todos os textos extraídos são mantidos em português BR
- A chave da API é armazenada apenas localmente no navegador do usuário para maior segurança
- Para uso em produção, recomenda-se configurar a chave via variável de ambiente
