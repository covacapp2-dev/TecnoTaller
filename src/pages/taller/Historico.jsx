import { useState, useEffect } from 'react';
import { Search, Download, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function Historico() {
  const { user } = useAuth();
  const [historical, setHistorical] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadHistorical();
  }, []);

  const loadHistorical = async () => {
    try {
      const { data, error } = await supabase
        .from('work_orders')
        .select('*, clients(name), vehicles(brand, model)')
        .eq('user_id', user.id)
        .eq('status', 'entregado')
        .order('created_at', { ascending: false });

      if (!error) setHistorical(data || []);
    } catch (error) {
      console.error('Error loading historical:', error);
    } finally {
      setLoading(false);
    }
  };

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
        <div className="relative mb-5">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar en histórico..."
            className="input-field pl-10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
          </div>
        ) : historical.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Filter className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No hay servicios completados ainda</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="text-left px-4 py-3 rounded-l-lg">Orden</th>
                  <th className="text-left px-4 py-3">Cliente</th>
                  <th className="text-left px-4 py-3">Vehículo</th>
                  <th className="text-right px-4 py-3 rounded-r-lg">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {historical.map(h => (
                  <tr key={h.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3.5 text-sm font-semibold text-primary-600">#{h.order_number}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-700">{h.clients?.name || '-'}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-700">
                      {h.vehicles ? `${h.vehicles.brand} ${h.vehicles.model}` : '-'}
                    </td>
                    <td className="px-4 py-3.5 text-sm font-bold text-gray-800 text-right">${Number(h.total).toLocaleString()}</td>
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
