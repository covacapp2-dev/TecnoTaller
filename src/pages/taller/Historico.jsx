import { useState } from 'react';
import { Search, Calendar, Download, Filter } from 'lucide-react';

const historical = [
  { id: '#H012', client: 'Pedro Alonso', vehicle: 'Renault Clio 2020', date: '10/06/2024', service: 'Cambio de correas', total: 95000, payStatus: 'pagado' },
  { id: '#H011', client: 'Sofía Romero', vehicle: 'Fiat Argo 2021', date: '08/06/2024', service: 'Service 20.000km', total: 42000, payStatus: 'pagado' },
  { id: '#H010', client: 'Diego Torres', vehicle: 'Hyundai i10 2019', date: '05/06/2024', service: 'Reparación de motor', total: 380000, payStatus: 'pagado' },
  { id: '#H009', client: 'Camila Silva', vehicle: 'Nissan March 2020', date: '01/06/2024', service: 'Alineación y balanceo', total: 25000, payStatus: 'pagado' },
  { id: '#H008', client: 'Martín Gómez', vehicle: 'Toyota Hilux 2018', date: '28/05/2024', service: 'Caja de cambios', total: 520000, payStatus: 'pagado' },
];

export default function Historico() {
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Histórico</h1>
          <p className="text-gray-500 text-sm mt-1">{historical.length} servicios completados</p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar
        </button>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 mb-5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar en histórico..."
              className="input-field pl-10"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <input type="date" className="input-field w-40" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            <input type="date" className="input-field w-40" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="text-left px-4 py-3 rounded-l-lg">Orden</th>
                <th className="text-left px-4 py-3">Cliente</th>
                <th className="text-left px-4 py-3">Vehículo</th>
                <th className="text-left px-4 py-3">Servicio</th>
                <th className="text-left px-4 py-3">Fecha</th>
                <th className="text-right px-4 py-3 rounded-r-lg">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {historical.map(h => (
                <tr key={h.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5 text-sm font-semibold text-primary-600">{h.id}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-700">{h.client}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-700">{h.vehicle}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-600">{h.service}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-500">{h.date}</td>
                  <td className="px-4 py-3.5 text-sm font-bold text-gray-800 text-right">${h.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
