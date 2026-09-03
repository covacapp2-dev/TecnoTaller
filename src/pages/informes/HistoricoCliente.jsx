import { Users } from 'lucide-react';

export default function HistoricoCliente() {
  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-6 h-6 text-primary-400" />
        <h1 className="text-xl font-bold text-white">Histórico por Cliente</h1>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400">Próximamente...</p>
      </div>
    </div>
  );
}