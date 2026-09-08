import { useState } from 'react';
import { Search, Car } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function Historico() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!search.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', user.id)
        .ilike('patente', search.trim())
        .single();
      if (!error && data) {
        setVehicle(data);
      } else {
        setVehicle(null);
      }
    } catch (e) {
      console.error('Error searching vehicle:', e);
      setVehicle(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="h-full bg-[#0f1219] p-4 flex flex-col">
      <div className="mb-4 flex-shrink-0">
        <h1 className="text-xl font-bold text-white">Histórico</h1>
      </div>

      <div className="flex gap-2 mb-4 flex-shrink-0">
        <input
          type="text"
          placeholder="Buscar Vehiculo.."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-[#1a1f2e] border border-gray-600 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-500"
        />
        <button onClick={handleSearch} className="bg-primary-600 hover:bg-primary-700 text-white w-10 h-10 rounded-lg flex items-center justify-center transition-colors flex-shrink-0">
          <Search className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Buscando...</div>
        ) : searched && !vehicle ? (
          <div className="text-center py-12 text-gray-500">No se encontró ningún vehículo con esa patente</div>
        ) : vehicle ? (
          <div className="bg-[#1a1f2e] border border-gray-700/50 rounded-xl p-5">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-[#0f1219] rounded-xl flex items-center justify-center flex-shrink-0">
                <Car className="w-10 h-10 text-primary-400" />
              </div>
              <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-3">
                <div>
                  <span className="text-gray-500 text-sm">Dominio:</span>
                  <p className="text-white font-mono font-bold">{vehicle.patente}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Tipo:</span>
                  <p className="text-white">{vehicle.vehicle_type || '-'}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Año:</span>
                  <p className="text-white">{vehicle.year || '-'}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">N° Chasis:</span>
                  <p className="text-white">{vehicle.chasis_number || '-'}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Color:</span>
                  <p className="text-white">{vehicle.color || '-'}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Seguro:</span>
                  <p className="text-white">{vehicle.insurance || '-'}</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}