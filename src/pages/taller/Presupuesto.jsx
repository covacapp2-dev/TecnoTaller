import { useState, useEffect } from 'react';
import { Search, Calendar, Plus, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const statusColors = {
  borrador: 'bg-gray-100 text-gray-700',
  enviado: 'bg-blue-100 text-blue-700',
  aprobado: 'bg-emerald-100 text-emerald-700',
  rechazado: 'bg-red-100 text-red-700',
};

export default function Presupuesto() {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*, clients(name), vehicles(brand, model)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error) setBudgets(data || []);
    } catch (error) {
      console.error('Error loading budgets:', error);
    } finally {
      setLoading(false);
    }
  };

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

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
          </div>
        ) : budgets.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Filter className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No hay presupuestos ainda</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="text-left px-4 py-3 rounded-l-lg">Estado</th>
                  <th className="text-left px-4 py-3">Vehículo</th>
                  <th className="text-left px-4 py-3">Cliente</th>
                  <th className="text-left px-4 py-3">Presupuesto</th>
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
                    <td className="px-4 py-3.5 text-sm font-medium text-gray-800">
                      {b.vehicles ? `${b.vehicles.brand} ${b.vehicles.model}` : '-'}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-700">{b.clients?.name || '-'}</td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-primary-600">#{b.budget_number}</td>
                    <td className="px-4 py-3.5 text-sm font-bold text-gray-800 text-right">${Number(b.total).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
