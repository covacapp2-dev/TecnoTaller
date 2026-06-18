import { useState } from 'react';
import { Search, Calendar, Filter, Plus, Eye, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const orders = [
  { id: '#00145', client: 'Juan Pérez', phone: '11-5555-1234', vehicle: 'Toyota Corolla 2020', patente: 'ABC-1234', status: 'pendiente', payStatus: 'pendiente', date: '18/06/2024', total: 185000 },
  { id: '#00144', client: 'María García', phone: '11-6666-5678', vehicle: 'Ford Fiesta 2019', patente: 'XYZ-5678', status: 'con_turno', payStatus: 'pendiente', date: '18/06/2024', total: 92000 },
  { id: '#00143', client: 'Carlos López', phone: '11-7777-9012', vehicle: 'Chevrolet Onix 2021', patente: 'DEF-9012', status: 'entregado', payStatus: 'pagado', date: '17/06/2024', total: 245000 },
  { id: '#00142', client: 'Ana Martínez', phone: '11-8888-3456', vehicle: 'Volkswagen Gol 2018', patente: 'GHI-3456', status: 'pendiente', payStatus: 'pendiente', date: '17/06/2024', total: 67000 },
  { id: '#00141', client: 'Roberto Sánchez', phone: '11-9999-7890', vehicle: 'Honda Civic 2022', patente: 'JKL-7890', status: 'entregado', payStatus: 'pagado', date: '16/06/2024', total: 320000 },
  { id: '#00140', client: 'Laura Díaz', phone: '11-1111-2345', vehicle: 'Peugeot 208 2021', patente: 'MNO-2345', status: 'con_turno', payStatus: 'pagado', date: '16/06/2024', total: 148000 },
  { id: '#00139', client: 'Pedro Alonso', phone: '11-2222-6789', vehicle: 'Renault Clio 2020', patente: 'PQR-6789', status: 'entregado', payStatus: 'pagado', date: '15/06/2024', total: 210000 },
];

const tabs = [
  { key: 'todos', label: 'Todos' },
  { key: 'pendiente', label: 'Pendiente' },
  { key: 'con_turno', label: 'Con Turno' },
  { key: 'entregado', label: 'Entregados' },
  { key: 'pago_pendiente', label: 'Pago Pendiente' },
  { key: 'pagado', label: 'Pago Realizado' },
];

const statusStyles = {
  pendiente: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  con_turno: { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  entregado: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
};

export default function Ordenes() {
  const [activeTab, setActiveTab] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filtered = orders.filter(order => {
    const matchesTab = activeTab === 'todos' ||
      (activeTab === 'pago_pendiente' && order.payStatus === 'pendiente') ||
      (activeTab === 'pagado' && order.payStatus === 'pagado') ||
      order.status === activeTab;
    const matchesSearch = !searchTerm ||
      order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.includes(searchTerm);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Órdenes de Trabajo</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} órdenes encontradas</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nueva Orden
        </button>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 mb-5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por cliente, vehículo o N° de orden..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
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

        <div className="flex gap-1 mb-5 overflow-x-auto pb-2 border-b border-gray-100">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="text-left px-4 py-3 rounded-l-lg">Estado</th>
                <th className="text-left px-4 py-3">Vehículo</th>
                <th className="text-left px-4 py-3">Cliente</th>
                <th className="text-left px-4 py-3">Orden</th>
                <th className="text-left px-4 py-3">Fecha</th>
                <th className="text-left px-4 py-3">Pago</th>
                <th className="text-right px-4 py-3 rounded-r-lg">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(order => {
                const st = statusStyles[order.status] || statusStyles.pendiente;
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${st.bg} ${st.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}></span>
                        {order.status === 'con_turno' ? 'Con Turno' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-medium text-gray-800">{order.vehicle}</p>
                      <p className="text-xs text-gray-400">{order.patente}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm text-gray-700">{order.client}</p>
                      <p className="text-xs text-gray-400">{order.phone}</p>
                    </td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-primary-600">{order.id}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-500">{order.date}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
                        order.payStatus === 'pagado' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {order.payStatus === 'pagado' ? 'Pagado' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm font-bold text-gray-800 text-right">${order.total.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Filter className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>No se encontraron órdenes con estos filtros</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
