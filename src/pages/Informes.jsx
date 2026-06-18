import { FileText, Download, Calendar, Filter, TrendingUp } from 'lucide-react';

const reports = [
  { id: 1, title: 'Reporte Mensual de Ingresos', date: 'Junio 2024', type: 'financiero', status: 'generado' },
  { id: 2, title: 'Órdenes por Estado', date: 'Junio 2024', type: 'operaciones', status: 'generado' },
  { id: 3, title: 'Inventario Bajo Mínimo', date: 'Junio 2024', type: 'inventario', status: 'generado' },
  { id: 4, title: 'Rendimiento de Trabajadores', date: 'Junio 2024', type: 'rrhh', status: 'pendiente' },
  { id: 5, title: 'Clientes con Deuda', date: 'Junio 2024', type: 'financiero', status: 'generado' },
  { id: 6, title: 'Top 10 Servicios', date: 'Junio 2024', type: 'ventas', status: 'generado' },
];

const typeColors = {
  financiero: 'bg-emerald-100 text-emerald-700',
  operaciones: 'bg-blue-100 text-blue-700',
  inventario: 'bg-amber-100 text-amber-700',
  rrhh: 'bg-violet-100 text-violet-700',
  ventas: 'bg-cyan-100 text-cyan-700',
};

export default function Informes() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Informes</h1>
        <button className="btn-primary flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Generar Informe
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="stat-card border-l-4 border-emerald-500">
          <p className="text-sm text-gray-500">Facturación Mensual</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">$2.450.000</p>
          <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12% vs mes anterior</p>
        </div>
        <div className="stat-card border-l-4 border-primary-500">
          <p className="text-sm text-gray-500">Órdenes Completadas</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">38</p>
          <p className="text-xs text-primary-600 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +5 vs mes anterior</p>
        </div>
        <div className="stat-card border-l-4 border-violet-500">
          <p className="text-sm text-gray-500">Ticket Promedio</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">$64.473</p>
          <p className="text-xs text-violet-600 mt-1">+8% vs mes anterior</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Informes Disponibles</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="text-left px-4 py-3 rounded-l-lg">Informe</th>
                <th className="text-left px-4 py-3">Período</th>
                <th className="text-left px-4 py-3">Tipo</th>
                <th className="text-left px-4 py-3">Estado</th>
                <th className="text-right px-4 py-3 rounded-r-lg">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5 text-sm font-medium text-gray-800">{r.title}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-500">{r.date}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${typeColors[r.type]}`}>
                      {r.type.charAt(0).toUpperCase() + r.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      r.status === 'generado' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button className="text-xs font-medium text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" /> Descargar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
