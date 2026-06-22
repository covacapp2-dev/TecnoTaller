import { useState, useEffect } from 'react';
import { Search, Calendar, Plus, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const tabs = [
  { key: 'todos', label: 'Todos' },
  { key: 'pendiente', label: 'Pendiente' },
  { key: 'con_turno', label: 'Con Turno' },
  { key: 'en_progreso', label: 'En Progreso' },
  { key: 'entregado', label: 'Entregados' },
  { key: 'pago_pendiente', label: 'Pago Pendiente' },
  { key: 'pagado', label: 'Pago Realizado' },
];

const statusStyles = {
  pendiente: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  con_turno: { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  en_progreso: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  entregado: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  cancelado: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
};

export default function Ordenes() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('work_orders')
        .select('*, clients(name), vehicles(brand, model, patente)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error) setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = orders.filter(order => {
    const matchesTab = activeTab === 'todos' ||
      (activeTab === 'pago_pendiente' && order.pay_status === 'pendiente') ||
      (activeTab === 'pagado' && order.pay_status === 'pagado') ||
      order.status === activeTab;
    const matchesSearch = !searchTerm ||
      (order.clients?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.vehicles?.brand || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(order.order_number).includes(searchTerm);
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

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-400 mt-3">Cargando órdenes...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Filter className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No hay órdenes ainda</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="text-left px-4 py-3 rounded-l-lg">Estado</th>
                  <th className="text-left px-4 py-3">Vehículo</th>
                  <th className="text-left px-4 py-3">Cliente</th>
                  <th className="text-left px-4 py-3">Orden</th>
                  <th className="text-left px-4 py-3">Pago</th>
                  <th className="text-right px-4 py-3 rounded-r-lg">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(order => {
                  const st = statusStyles[order.status] || statusStyles.pendiente;
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${st.bg} ${st.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}></span>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-medium text-gray-800">
                        {order.vehicles ? `${order.vehicles.brand} ${order.vehicles.model}` : '-'}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-700">{order.clients?.name || '-'}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-primary-600">#{order.order_number}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
                          order.pay_status === 'pagado' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {order.pay_status === 'pagado' ? 'Pagado' : 'Pendiente'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-bold text-gray-800 text-right">${Number(order.total).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
