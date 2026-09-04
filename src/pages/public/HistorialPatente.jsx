import { useState, useEffect } from 'react';
import { Car, Search, FileText, Calendar, Wrench, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function HistorialPatente({ patente: patenteProp, vehicleData, onBack }) {
  const [patente, setPatente] = useState(patenteProp || '');
  const [searching, setSearching] = useState(false);
  const [orders, setOrders] = useState([]);
  const [searched, setSearched] = useState(!!patenteProp);

  useEffect(() => {
    if (patenteProp) handleSearch();
  }, []);

  const inputClass = "bg-[#1a1f2e] border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-full";
  const labelClass = "block text-xs text-gray-400 mb-1";

  const handleSearch = async () => {
    if (!patente.trim()) return;
    setSearching(true);
    setSearched(true);

    try {
      const { data: vehicles } = await supabase
        .from('vehicles')
        .select('id, patente, brand, model')
        .ilike('patente', patente.trim());

      if (vehicles && vehicles.length > 0) {
        const vehicleIds = vehicles.map(v => v.id);
        const { data: workOrders } = await supabase
          .from('work_orders')
          .select('*')
          .in('vehicle_id', vehicleIds)
          .order('created_at', { ascending: false });

        setOrders(workOrders || []);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error(err);
      setOrders([]);
    }
    setSearching(false);
  };

  return (
    <div className="min-h-screen bg-[#0f1219] flex items-center justify-center p-4">
      <div className="bg-[#1a1f2e] border border-gray-700 rounded-2xl p-6 max-w-md w-full">
        <div className="text-center mb-6">
          {onBack && (
            <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-3 mx-auto transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Volver
            </button>
          )}
          <img src="/logopwa.ico" alt="TecnoTaller" className="w-12 h-12 mx-auto mb-3 rounded-xl" />
          <h1 className="text-xl font-bold text-white">Historial del Vehículo</h1>
          <p className="text-gray-400 text-xs mt-1">Ingresá la patente para ver el historial</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Patente</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  className={inputClass + " pl-10"}
                  placeholder="ABC123"
                  value={patente}
                  onChange={e => setPatente(e.target.value.toUpperCase())}
                  onKeyPress={e => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button onClick={handleSearch} disabled={searching || !patente.trim()} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {searched && (
            <div className="space-y-3">
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No se encontraron registros para esa patente</p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-gray-500">{orders.length} registro(s) encontrado(s)</p>
                  {orders.map(order => (
                    <div key={order.id} className="bg-[#0f1219] border border-gray-700 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-primary-400" />
                        <span className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('es-AR')}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${order.status === 'completada' ? 'bg-green-500/20 text-green-400' : order.status === 'en_progreso' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-white">{order.description || 'Sin descripción'}</span>
                      </div>
                      {order.total > 0 && (
                        <p className="text-xs text-gray-400 mt-1 ml-6">Total: ${order.total.toLocaleString('es-AR')}</p>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}