import { TrendingUp } from 'lucide-react';

export default function VentaMensual() {
  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-primary-400" />
        <h1 className="text-xl font-bold text-white">Venta Mensual</h1>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400">Proximamente...</p>
      </div>
    </div>
  );
}