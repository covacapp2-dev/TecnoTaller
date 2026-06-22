import { useState, useEffect } from 'react';
import { Search, Plus, Car, Eye, Edit2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function Vehiculos() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*, clients(name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error) setVehicles(data || []);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = vehicles.filter(v =>
    `${v.brand} ${v.model} ${v.patente} ${v.clients?.name || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Vehículos</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} vehículos registrados</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Vehículo
        </button>
      </div>

      <div className="card">
        <div className="relative mb-5">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por marca, modelo, patente o cliente..."
            className="input-field pl-10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Car className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No hay vehículos ainda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(v => (
              <div key={v.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-primary-200 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
                      <Car className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{v.brand} {v.model}</p>
                      <p className="text-xs text-gray-400">{v.year} • {v.color}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary-100 text-primary-700">
                    {v.patente}
                  </span>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Cliente</span>
                    <span className="font-medium text-gray-700">{v.clients?.name || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Kilometraje</span>
                    <span className="font-medium text-gray-700">{Number(v.km).toLocaleString()} km</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                  <button className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-primary-600 hover:bg-primary-50 py-1.5 rounded-lg transition-colors">
                    <Eye className="w-3.5 h-3.5" /> Ver
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-gray-600 hover:bg-gray-100 py-1.5 rounded-lg transition-colors">
                    <Edit2 className="w-3.5 h-3.5" /> Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
