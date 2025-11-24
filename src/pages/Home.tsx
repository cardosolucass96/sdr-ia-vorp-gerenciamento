import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Smartphone } from 'lucide-react';

export function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <Smartphone className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Gerenciamento de Instâncias
        </h1>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          Acesse /{'{'}instanceName{'}'} para conectar uma instância do WhatsApp
        </p>
        <div className="space-x-4">
          <Link to="/inovari">
            <Button size="lg">
              Conectar Inovari
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
