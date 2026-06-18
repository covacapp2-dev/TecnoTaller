import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';

const barData = [
  { month: 'Ene', ingresos: 1800000, egresos: 950000 },
  { month: 'Feb', ingresos: 2100000, egresos: 1100000 },
  { month: 'Mar', ingresos: 1950000, egresos: 1000000 },
  { month: 'Abr', ingresos: 2400000, egresos: 1200000 },
  { month: 'May', ingresos: 2200000, egresos: 1050000 },
  { month: 'Jun', ingresos: 2450000, egresos: 1150000 },
];

const maxVal = Math.max(...barData.map(d => d.ingresos));

const services = [
  { name: 'Cambio de aceite', count: 35, percentage: 28 },
  { name: 'Frenos', count: 22, percentage: 18 },
  { name: 'Motor', count: 18, percentage: 14 },
  { name: 'Electricidad', count: 15, percentage: 12 },
  { name: 'Alineación', count: 12, percentage: 10 },
  { name: 'Otros', count: 23, percentage: 18 },
];

const serviceColors = ['bg-primary-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-gray-400'];

export default function Grafica() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Gráficas</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-bold text-gray-800">Ingresos vs Egresos</h2>
          </div>
          <div className="space-y-3">
            {barData.map(d => (
              <div key={d.month} className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-500 w-8">{d.month}</span>
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                      style={{ width: `${(d.ingresos / maxVal) * 100}%` }}
                    />
                  </div>
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-400 to-red-300 rounded-full transition-all duration-500"
                      style={{ width: `${(d.egresos / maxVal) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right w-20">
                  <p className="text-xs font-semibold text-primary-600">${(d.ingresos / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-red-500">${(d.egresos / 1000000).toFixed(1)}M</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-3 h-3 rounded bg-primary-500"></span> Ingresos
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-3 h-3 rounded bg-red-400"></span> Egresos
            </span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-5">
            <PieChart className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-bold text-gray-800">Servicios más solicitados</h2>
          </div>
          <div className="space-y-3">
            {services.map((s, i) => (
              <div key={s.name} className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${serviceColors[i]} flex-shrink-0`}></span>
                <span className="text-sm text-gray-700 flex-1">{s.name}</span>
                <div className="w-32 bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${serviceColors[i]} transition-all duration-500`}
                    style={{ width: `${s.percentage}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-500 w-12 text-right">{s.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
