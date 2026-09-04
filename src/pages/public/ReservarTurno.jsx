import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, User, Phone, MapPin, Car, Check, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ReservarTurno({ userId: userIdProp, patente: patenteProp, vehicleData, onBack }) {
  const { userId: userIdParam } = useParams();
  const userId = userIdProp || userIdParam;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    celular: '',
    direccion: '',
    patente: patenteProp || '',
    modelo: vehicleData ? `${vehicleData.brand} ${vehicleData.model}` : '',
    fecha: '',
    hora: '09:00',
    descripcion: '',
  });

  const inputClass = "bg-[#1a1f2e] border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-full";
  const labelClass = "block text-xs text-gray-400 mb-1";

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from('calendar_events').insert({
        user_id: userId,
        title: `${form.nombre} - ${form.patente}`,
        event_date: form.fecha,
        event_time: form.hora,
        type: 'turno',
        client_name: form.nombre,
        client_phone: form.celular,
        notes: `Patente: ${form.patente} | Modelo: ${form.modelo} | Dir: ${form.direccion} | ${form.descripcion}`,
      });

      if (!error) {
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0f1219] flex items-center justify-center p-4">
        <div className="bg-[#1a1f2e] border border-gray-700 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Turno Reservado</h1>
          <p className="text-gray-400 text-sm mb-4">
            Tu turno fue reservado correctamente para el {form.fecha} a las {form.hora}.
          </p>
          <p className="text-gray-500 text-xs">Te contactaremos para confirmar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1219] flex items-center justify-center p-4">
      <div className="bg-[#1a1f2e] border border-gray-700 rounded-2xl p-6 max-w-md w-full">
        <div className="text-center mb-6">
          <img src="/logopwa.ico" alt="TecnoTaller" className="w-12 h-12 mx-auto mb-3 rounded-xl" />
          <h1 className="text-xl font-bold text-white">Reservar Turno</h1>
          <p className="text-gray-400 text-xs mt-1">Completá tus datos para agendar</p>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Nombre y apellido *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" className={inputClass + " pl-10"} placeholder="Tu nombre..." value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Celular *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="tel" className={inputClass + " pl-10"} placeholder="Tu celular..." value={form.celular} onChange={e => setForm({ ...form, celular: e.target.value })} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Dirección</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" className={inputClass + " pl-10"} placeholder="Tu dirección..." value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Patente *</label>
                <div className="relative">
                  <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="text" className={inputClass + " pl-10"} placeholder="ABC123" value={form.patente} onChange={e => setForm({ ...form, patente: e.target.value.toUpperCase() })} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Modelo auto</label>
                <input type="text" className={inputClass} placeholder="Ford Fiesta..." value={form.modelo} onChange={e => setForm({ ...form, modelo: e.target.value })} />
              </div>
            </div>
            <button onClick={() => setStep(2)} disabled={!form.nombre.trim() || !form.celular.trim() || !form.patente.trim()} className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              Siguiente <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Fecha del turno *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="date" className={inputClass + " pl-10"} value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Horario preferido *</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="time" className={inputClass + " pl-10"} value={form.hora} onChange={e => setForm({ ...form, hora: e.target.value })} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Descripción del problema</label>
              <textarea className={inputClass + " resize-none"} rows={3} placeholder="Contanos qué necesitás..." value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 py-2.5 rounded-lg text-sm font-medium transition-colors">Volver</button>
              <button onClick={handleSubmit} disabled={!form.fecha || loading} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                {loading ? 'Guardando...' : 'Reservar Turno'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}