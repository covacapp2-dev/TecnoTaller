import { useState, useEffect } from 'react';
import { Search, Plus, UserCheck, Mail, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Trabajadores() {
  const { user } = useAuth();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    try {
      const { data, error } = await supabase
        .from('workers')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (!error) setWorkers(data || []);
    } catch (error) {
      console.error('Error loading workers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Trabajadores</h1>
          <p className="text-gray-500 text-sm mt-1">{workers.length} empleados</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Trabajador
        </button>
      </div>

      <div className="card">
        <div className="relative mb-5">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar trabajador..."
            className="input-field pl-10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
          </div>
        ) : workers.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <UserCheck className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No hay trabajadores ainda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workers.map(w => (
              <div key={w.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-primary-200 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {w.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{w.name}</p>
                    <p className="text-xs text-primary-600 font-medium capitalize">{w.role}</p>
                  </div>
                </div>
                <div className="space-y-1.5 text-sm">
                  {w.phone && (
                    <p className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-3.5 h-3.5" /> {w.phone}
                    </p>
                  )}
                  {w.email && (
                    <p className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-3.5 h-3.5" /> {w.email}
                    </p>
                  )}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Activo
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
