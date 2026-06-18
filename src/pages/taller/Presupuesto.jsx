import { useState } from 'react';
import { Search, Calendar, Plus, FileText, Eye, Send, Download, Filter } from 'lucide-react';

const budgets = [
  { id: '#P001', client: 'Juan Pérez', vehicle: 'Toyota Corolla 2020', date: '18/06/2024', status: 'enviado', total: 185000, items: 4 },
  { id: '#P002', client: 'María García', vehicle: 'Ford Fiesta 2019', date: '17/06/2024', status: 'borrador', total: 92000, items: 2 },
  { id: '#P003', client: 'Carlos López', vehicle: 'Chevrolet Onix 2021', date: '16/06/2024', status: 'aprobado', total: 245000, items: 6 },
  { id: '#P004', client: 'Laura Díaz', vehicle: 'Peugeot 208 2021', date: '15/06/2024', status: 'rechazado', total: 148000, items: 3 },
];

const statusColors = {
  borrador: 'bg-gray-100 text-gray-700',
  enviado: 'bg-blue-100 text-blue-700',
  aprobado: 'bg-emerald-100 text-emerald-700',
  rechazado: 'bg-red-100 text-red-700',
};

export default function Presupuesto() {
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Presupuestos</h1>
          <p className="text-gray-500 text-sm mt-1">{budgets.length} presupuestos</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo
        </button>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 mb-5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar presupuesto..."
              className="input-field pl-10"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              className="input-field pl-10 w-48"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="text-left px-4 py-3 rounded-l-lg">Estado</th>
                <th className="text-left px-4 py-3">Vehículo</th>
                <th className="text-left px-4 py-3">Cliente</th>
                <th className="text-left px-4 py-3">Presupuesto</th>
                <th className="text-left px-4 py-3">Fecha</th>
                <th className="text-left px-4 py-3">Ítems</th>
                <th className="text-right px-4 py-3 rounded-r-lg">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {budgets.map(b => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[b.status]}`}>
                      {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-medium text-gray-800">{b.vehicle}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-700">{b.client}</td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-primary-600">{b.id}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-500">{b.date}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-500">{b.items} ítems</td>
                  <td className="px-4 py-3.5 text-sm font-bold text-gray-800 text-right">${b.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
