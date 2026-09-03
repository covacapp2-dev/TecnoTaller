import { useState, useEffect } from 'react';
import { Search, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const filterOptions = [
  { key: 'todos', label: 'Todos' },
  { key: 'pendiente', label: 'Estado Pendiente' },
  { key: 'con_turno', label: 'Estado Con turno' },
  { key: 'entregado', label: 'Estado Entregados' },
  { key: 'pago_pendiente', label: 'Pago pendiente' },
  { key: 'pagado', label: 'Pago realizado' },
];

const statusColors = {
  pendiente: { bg: 'bg-amber-500/20', text: 'text-amber-400', dot: 'bg-amber-400' },
  con_turno: { bg: 'bg-purple-500/20', text: 'text-purple-400', dot: 'bg-purple-400' },
  en_progreso: { bg: 'bg-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-400' },
  entregado: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  cancelado: { bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-400' },
};

const statusLabels = {
  pendiente: 'Pendiente',
  con_turno: 'Con Turno',
  en_progreso: 'En Progreso',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

export default function Ordenes() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');

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
    const matchesFilter = activeFilter === 'todos' ||
      (activeFilter === 'pago_pendiente' && order.pay_status === 'pendiente') ||
      (activeFilter === 'pagado' && order.pay_status === 'pagado') ||
      order.status === activeFilter;
    const matchesSearch = !searchTerm ||
      (order.clients?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.vehicles?.brand || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.vehicles?.patente || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(order.order_number).includes(searchTerm);
    const matchesDateFrom = !dateFrom || new Date(order.created_at) >= new Date(dateFrom);
    const matchesDateTo = !dateTo || new Date(order.created_at) <= new Date(dateTo + 'T23:59:59');
    return matchesFilter && matchesSearch && matchesDateFrom && matchesDateTo;
  }).sort((a, b) => {
    if (sortField === 'created_at') {
      return sortDir === 'asc' ? new Date(a.created_at) - new Date(b.created_at) : new Date(b.created_at) - new Date(a.created_at);
    }
    if (sortField === 'total') {
      return sortDir === 'asc' ? a.total - b.total : b.total - a.total;
    }
    return 0;
  });

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  return (
    <div className="h-full bg-[#0f1219] p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Órdenes</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 bg-[#1a1f2e] border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-300 hover:border-primary-500 transition-colors"
            >
              {filterOptions.find(f => f.key === activeFilter)?.label}
              <ChevronDown className="w-4 h-4" />
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-full mt-1 bg-[#1a1f2e] border border-gray-600 rounded-lg shadow-xl z-50 min-w-[200px] py-1">
                {filterOptions.map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => { setActiveFilter(opt.key); setFilterOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      activeFilter === opt.key
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-300 hover:bg-[#222839]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="bg-[#1a1f2e] border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-primary-500 w-36"
          />
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="bg-[#1a1f2e] border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-primary-500 w-36"
          />
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors">
            <Plus className="w-4 h-4" />
            Nuevo
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-[#1a1f2e] border border-gray-600 rounded-lg overflow-hidden">
          <span className="text-gray-500 text-xs pl-3">ID</span>
          <div className="w-px h-6 bg-gray-600" />
          <button className="p-1.5 text-gray-400 hover:text-white">
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por cliente, vehículo o patente..."
            className="w-full bg-[#1a1f2e] border border-gray-600 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-primary-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="bg-[#1a1f2e] border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-300 hover:border-primary-500 transition-colors">
          Por defecto
        </button>
        <button className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-lg transition-colors">
          <Search className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 mt-3 text-sm">Cargando órdenes...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-sm">No se encontraron órdenes</p>
        </div>
      ) : (
        <div className="bg-[#1a1f2e] border border-gray-700/50 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Estado</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Vehículo</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Cliente</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium cursor-pointer hover:text-white" onClick={() => toggleSort('created_at')}>
                  <span className="flex items-center gap-1">
                    Fecha
                    {sortField === 'created_at' && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </span>
                </th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Pago</th>
                <th className="text-right px-4 py-3 text-gray-400 font-medium cursor-pointer hover:text-white" onClick={() => toggleSort('total')}>
                  <span className="flex items-center justify-end gap-1">
                    Total
                    {sortField === 'total' && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filtered.map(order => {
                const st = statusColors[order.status] || statusColors.pendiente;
                return (
                  <tr key={order.id} className="hover:bg-[#222839] transition-colors cursor-pointer">
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${st.bg} ${st.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}></span>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {order.vehicles ? `${order.vehicles.brand} ${order.vehicles.model}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-300">{order.clients?.name || '-'}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(order.created_at).toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold ${
                        order.pay_status === 'pagado' ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {order.pay_status === 'pagado' ? 'Pagado' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-white">
                      ${Number(order.total).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
