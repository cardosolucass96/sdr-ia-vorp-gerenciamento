import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { evolutionApi } from '../../functions/api/evolutionApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Loader2, AlertCircle, Smartphone } from 'lucide-react';

type ConnectionStatus = 
  | 'checking' 
  | 'connected' 
  | 'disconnected' 
  | 'generating-qr' 
  | 'waiting-scan'
  | 'error';

export function InstanceConnection() {
  const { instanceName } = useParams<{ instanceName: string }>();
  const [status, setStatus] = useState<ConnectionStatus>('checking');
  const [qrCode, setQrCode] = useState<string>('');
  const [qrAttempts, setQrAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPolling, setIsPolling] = useState(false);

  const MAX_QR_ATTEMPTS = 3;
  const POLLING_INTERVAL = 3000; // 3 segundos

  // Polling para verificar conexão
  const startPolling = useCallback(() => {
    if (!instanceName || isPolling) return;

    setIsPolling(true);

    const pollInterval = setInterval(async () => {
      try {
        const response = await evolutionApi.getConnectionState(instanceName);
        
        if (response.instance.state === 'open') {
          setStatus('connected');
          setIsPolling(false);
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error('Erro no polling:', error);
      }
    }, POLLING_INTERVAL);

    // Limpa o polling após 2 minutos
    setTimeout(() => {
      clearInterval(pollInterval);
      setIsPolling(false);
    }, 120000);

    return () => {
      clearInterval(pollInterval);
      setIsPolling(false);
    };
  }, [instanceName, isPolling, POLLING_INTERVAL]);

  // Verifica o status inicial da instância
  const checkInitialStatus = useCallback(async () => {
    if (!instanceName) return;

    try {
      setStatus('checking');
      const response = await evolutionApi.checkInstanceStatus(instanceName);
      
      console.log('API Response:', response); // Debug
      
      // Valida se a resposta tem a estrutura esperada
      if (!response || !response.instance) {
        console.error('Invalid response structure:', response);
        setStatus('disconnected');
        return;
      }
      
      if (response.instance.state === 'open') {
        setStatus('connected');
        return;
      }
      
      // Se está em qualquer outro estado (close, connecting, etc), mostra como desconectado
      setStatus('disconnected');
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      setStatus('disconnected');
    }
  }, [instanceName]);

  // Gera o QR Code
  const generateQRCode = useCallback(async () => {
    if (!instanceName || qrAttempts >= MAX_QR_ATTEMPTS) return;

    try {
      setStatus('generating-qr');
      setErrorMessage('');
      setQrAttempts((prev) => prev + 1);

      const response = await evolutionApi.connectInstance(instanceName);
      
      if (response.base64) {
        setQrCode(response.base64);
        setStatus('waiting-scan');
        startPolling();
      } else {
        setErrorMessage('QR Code não disponível');
        setStatus('error');
      }
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      const err = error as { response?: { data?: { message?: string } } };
      setErrorMessage(err?.response?.data?.message || 'Erro ao gerar QR Code');
      setStatus('error');
      
      if (qrAttempts >= MAX_QR_ATTEMPTS) {
        setErrorMessage('Número máximo de tentativas atingido. Clique no botão para tentar novamente.');
      }
    }
  }, [instanceName, qrAttempts, MAX_QR_ATTEMPTS, startPolling]);

  // Reseta as tentativas
  const resetAttempts = () => {
    setQrAttempts(0);
    setErrorMessage('');
    generateQRCode();
  };

  useEffect(() => {
    void checkInitialStatus();
  }, [checkInitialStatus]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardHeader className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto">
              <Smartphone className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Conexão WhatsApp</CardTitle>
            <CardDescription className="text-base">
              Instância: <span className="font-semibold text-foreground">{instanceName}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">

          {/* Status: Verificando */}
          {status === 'checking' && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertTitle>Verificando</AlertTitle>
              <AlertDescription>
                Verificando status da instância...
              </AlertDescription>
            </Alert>
          )}

          {/* Status: Conectado */}
          {status === 'connected' && (
            <Alert className="border-primary">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <AlertTitle>Instância Ativa e Conectada</AlertTitle>
              <AlertDescription>
                Sua instância está funcionando normalmente
              </AlertDescription>
            </Alert>
          )}

          {/* Status: Desconectado */}
          {status === 'disconnected' && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Instância Desconectada</AlertTitle>
                <AlertDescription>
                  Conecte seu WhatsApp para começar
                </AlertDescription>
              </Alert>
              <Button 
                onClick={generateQRCode} 
                size="lg"
                className="w-full"
              >
                Gerar QR Code
              </Button>
            </div>
          )}

          {/* Status: Gerando QR Code */}
          {status === 'generating-qr' && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertTitle>Gerando QR Code</AlertTitle>
              <AlertDescription>
                Aguarde enquanto geramos seu QR Code...
              </AlertDescription>
            </Alert>
          )}

          {/* Status: Aguardando Leitura do QR Code */}
          {status === 'waiting-scan' && qrCode && (
            <div className="space-y-4">
              <div className="flex justify-center p-6 bg-muted/50 rounded-lg border-2 border-dashed">
                <img 
                  src={qrCode} 
                  alt="QR Code" 
                  className="w-full max-w-[280px] grayscale contrast-[2] brightness-90"
                />
              </div>
              
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertTitle>Aguardando leitura do QR Code</AlertTitle>
                <AlertDescription>
                  <div className="space-y-2">
                    <p>Escaneie o código com seu WhatsApp</p>
                    <Badge variant="secondary" className="font-normal">
                      Tentativa {qrAttempts} de {MAX_QR_ATTEMPTS}
                    </Badge>
                  </div>
                </AlertDescription>
              </Alert>

              <Separator />

              <div className="space-y-3">
                <p className="text-sm font-semibold">Como escanear:</p>
                <ol className="space-y-2 text-sm text-muted-foreground pl-4">
                  <li className="pl-2">1. Abra o WhatsApp no seu telefone</li>
                  <li className="pl-2">2. Toque em <span className="font-medium text-foreground">Mais opções</span> ou <span className="font-medium text-foreground">Configurações</span></li>
                  <li className="pl-2">3. Toque em <span className="font-medium text-foreground">Aparelhos conectados</span></li>
                  <li className="pl-2">4. Toque em <span className="font-medium text-foreground">Conectar um aparelho</span></li>
                  <li className="pl-2">5. Aponte seu telefone para esta tela</li>
                </ol>
              </div>
            </div>
          )}

          {/* Status: Erro */}
          {status === 'error' && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro na Conexão</AlertTitle>
                <AlertDescription>
                  {errorMessage}
                </AlertDescription>
              </Alert>
              
              {qrAttempts >= MAX_QR_ATTEMPTS ? (
                <Button 
                  onClick={resetAttempts} 
                  size="lg"
                  variant="destructive"
                  className="w-full"
                >
                  Tentar Novamente
                </Button>
              ) : (
                <Button 
                  onClick={generateQRCode} 
                  size="lg"
                  className="w-full"
                >
                  Gerar Novo QR Code
                </Button>
              )}
            </div>
          )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Powered by Grupo Vorp
        </p>
      </div>
    </div>
  );
}
