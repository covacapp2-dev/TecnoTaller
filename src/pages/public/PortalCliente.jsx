import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Car, Search, Calendar, FileText, Phone, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ReservarTurno from './ReservarTurno';
import HistorialPatente from './HistorialPatente';

export default function PortalCliente() {
  const { userId } = useParams();
  const [step, setStep] = useState('patente');
  const [patente, setPatente] = useState('');
  const [loading, setLoading] = useState(false);
  const [found, setFound] = useState(false);
  const [vehicleData, setVehicleData] = useState(null);

  const inputClass = "bg-[#1a1f2e] border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-full";

  const handleSearch = async () => {
    if (!patente.trim()) return;
    setLoading(true);

    try {
      const { data: vehicles } = await supabase
        .from('vehicles')
        .select('id, patente, brand, model, client_id')
        .ilike('patente', patente.trim());

      if (vehicles && vehicles.length > 0) {
        setFound(true);
        setVehicleData(vehicles[0]);
      } else {
        setFound(false);
      }
    } catch (err) {
      console.error(err);
      setFound(false);
    }
    setLoading(false);
  };

  const handleOption = (option) => {
    setStep(option);
  };

  if (step === 'turno') {
    return <ReservarTurno userId={userId} patente={patente} vehicleData={vehicleData} onBack={() => setStep('patente')} />;
  }

  if (step === 'historial') {
    return <HistorialPatente patente={patente} vehicleData={vehicleData} onBack={() => setStep('patente')} />;
  }

  return (
    <div className="min-h-screen bg-[#0f1219] flex items-center justify-center p-4">
      <div className="bg-[#1a1f2e] border border-gray-700 rounded-2xl p-6 max-w-md w-full">
        <div className="text-center mb-6">
          <img src="/logopwa.ico" alt="TecnoTaller" className="w-12 h-12 mx-auto mb-3 rounded-xl" />
          <h1 className="text-xl font-bold text-white">TecnoTaller</h1>
          <p className="text-gray-400 text-xs mt-1">Ingresá la patente de tu vehículo</p>
        </div>

        {!found ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Patente *</label>
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
                <button onClick={handleSearch} disabled={loading || !patente.trim()} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {patente && !loading && (
              <div className="bg-[#0f1219] border border-gray-700 rounded-lg p-4 text-center">
                <Phone className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm mb-2">No encontramos tu vehículo</p>
                <p className="text-gray-500 text-xs">Contactate con tu mecánico para que registre tu patente en el sistema.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-[#0f1219] border border-gray-700 rounded-lg p-4 text-center">
              <Car className="w-10 h-10 text-green-400 mx-auto mb-2" />
              <p className="text-white font-medium">{vehicleData?.brand} {vehicleData?.model}</p>
              <p className="text-gray-400 text-sm">{vehicleData?.patente}</p>
            </div>

            <button onClick={() => handleOption('turno')} className="w-full flex items-center gap-3 bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-lg transition-colors">
              <Calendar className="w-6 h-6" />
              <div className="text-left">
                <p className="font-medium">Reservar Turno</p>
                <p className="text-xs text-primary-200">Agendá un turno para tu vehículo</p>
              </div>
            </button>

            <button onClick={() => handleOption('historial')} className="w-full flex items-center gap-3 bg-[#0f1219] hover:bg-[#1a1f2e] border border-gray-700 text-white p-4 rounded-lg transition-colors">
              <FileText className="w-6 h-6 text-gray-400" />
              <div className="text-left">
                <p className="font-medium">Ver Historial</p>
                <p className="text-xs text-gray-400">Revisá los servicios realizados</p>
              </div>
            </button>

            <button onClick={() => { setFound(false); setPatente(''); setVehicleData(null); }} className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-400 text-sm py-2 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Otra patente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}