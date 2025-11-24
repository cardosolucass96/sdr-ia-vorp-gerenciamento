import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Smartphone } from 'lucide-react';

export function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full">
          <Smartphone className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">
          Gerenciamento de Instâncias
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Acesse /conexao/{'{'}instanceName{'}'} para conectar uma instância do WhatsApp
        </p>
        <div className="space-x-4">
          <Link to="/conexao/inovari">
            <Button size="lg">
              Conectar Inovari
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
