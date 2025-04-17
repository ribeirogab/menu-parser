import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { hasApiKey, setApiKey, removeApiKey } from '../lib/openai';
import { AlertCircle, Check, Key, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

export function ApiKeyInput() {
  const [apiKey, setApiKeyState] = useState('');
  const [isKeySet, setIsKeySet] = useState(false);
  const [showInput, setShowInput] = useState(false);

  // Check if API key is already set on component mount
  useEffect(() => {
    setIsKeySet(hasApiKey());
  }, []);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      setApiKey(apiKey.trim());
      setIsKeySet(true);
      setShowInput(false);
    }
  };

  const handleShowInput = () => {
    setShowInput(true);
  };

  const handleCancel = () => {
    setApiKeyState('');
    setShowInput(false);
  };

  const handleRemoveKey = () => {
    if (confirm('Tem certeza que deseja remover a chave da API?')) {
      removeApiKey();
      setIsKeySet(false);
      setApiKeyState('');
    }
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Chave da API OpenAI
        </CardTitle>
        <CardDescription>
          É necessário fornecer uma chave de API válida da OpenAI para analisar imagens de cardápios.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isKeySet && !showInput ? (
          <Alert className="bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">
              Chave da API configurada com sucesso.
            </AlertDescription>
          </Alert>
        ) : showInput ? (
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKeyState(e.target.value)}
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              A chave será armazenada apenas no seu navegador e não será enviada para nenhum servidor.
            </p>
          </div>
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Nenhuma chave da API configurada. Você precisa configurar uma chave para usar o analisador de cardápios.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {isKeySet && !showInput ? (
          <>
            <Button variant="outline" size="icon" onClick={handleRemoveKey} className="text-red-500 hover:text-red-700 hover:bg-red-50">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleShowInput}>
              Alterar chave
            </Button>
          </>
        ) : showInput ? (
          <>
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button onClick={handleSaveKey} disabled={!apiKey.trim()}>
              Salvar chave
            </Button>
          </>
        ) : (
          <Button onClick={handleShowInput}>
            Configurar chave
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
