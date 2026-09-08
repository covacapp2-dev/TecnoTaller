import { useState, useEffect } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const emptyForm = {
  dominio: '', marca: '', modelo: '', tipo: '', color: '', anio: '', chasis: '', cc: '', seguro: ''
};

export default function Vehiculos() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadVehicles(); }, []);

  const loadVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*, clients(name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (!error) setVehicles(data || []);
    } catch (e) {
      console.error('Error loading vehicles:', e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = vehicles.filter(v =>
    `${v.brand || ''} ${v.model || ''} ${v.patente || ''} ${v.clients?.name || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!form.dominio.trim()) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('vehicles').insert({
        user_id: user.id,
        patente: form.dominio.trim(),
        brand: form.marca.trim(),
        model: form.modelo.trim(),
        vehicle_type: form.tipo.trim(),
        color: form.color.trim(),
        year: form.anio ? Number(form.anio) : null,
        chasis_number: form.chasis.trim(),
        cc: form.cc ? Number(form.cc) : null,
        insurance: form.seguro.trim(),
      });
      if (!error) {
        setShowModal(false);
        setForm(emptyForm);
        loadVehicles();
      }
    } catch (e) {
      console.error('Error saving vehicle:', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full bg-[#0f1219] p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h1 className="text-xl font-bold text-white">Vehículos</h1>
        <button onClick={() => setShowModal(true)} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          Nuevo
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-700/50 overflow-hidden flex flex-col h-full">
          <div className="flex items-center gap-2 p-3 border-b border-gray-700/50 flex-shrink-0">
            <select className="bg-[#0f1219] border border-gray-600 rounded-lg px-3 py-1.5 text-white text-sm">
              <option>Marca</option>
            </select>
            <button className="bg-primary-600 hover:bg-primary-700 text-white w-7 h-7 rounded-lg flex items-center justify-center text-sm">+</button>
            <div className="flex-1" />
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-[#0f1219] border border-gray-600 rounded-lg px-3 py-1.5 text-white text-sm w-48"
              />
            </div>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-lg text-sm">🔍</button>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#151a26] sticky top-0">
                <tr className="text-gray-400 text-left text-xs uppercase">
                  <th className="px-4 py-3 font-medium">Vehículo</th>
                  <th className="px-4 py-3 font-medium">Dominio</th>
                  <th className="px-4 py-3 font-medium">Tipo</th>
                  <th className="px-4 py-3 font-medium">Color</th>
                  <th className="px-4 py-3 font-medium">Año</th>
                  <th className="px-4 py-3 font-medium">N° Chasis</th>
                  <th className="px-4 py-3 font-medium">CC</th>
                  <th className="px-4 py-3 font-medium">Seguro</th>
                  <th className="px-4 py-3 font-medium">Órdenes</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} className="text-center py-12 text-gray-500">Cargando...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={9} className="text-center py-12 text-gray-500">No hay vehículos</td></tr>
                ) : filtered.map(v => (
                  <tr key={v.id} className="border-t border-gray-700/30 hover:bg-[#1e2433] text-gray-300">
                    <td className="px-4 py-3">{v.brand} {v.model}</td>
                    <td className="px-4 py-3 font-mono font-bold text-white">{v.patente}</td>
                    <td className="px-4 py-3">{v.vehicle_type || '-'}</td>
                    <td className="px-4 py-3">{v.color || '-'}</td>
                    <td className="px-4 py-3">{v.year || '-'}</td>
                    <td className="px-4 py-3">{v.chasis_number || '-'}</td>
                    <td className="px-4 py-3">{v.cc || '-'}</td>
                    <td className="px-4 py-3">{v.insurance || '-'}</td>
                    <td className="px-4 py-3 text-primary-400">0</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[#1a1f2e] border border-gray-700 rounded-2xl w-full max-w-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Nuevo Vehículo</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-red-400 text-xs font-medium mb-1">* Dominio</label>
                <input value={form.dominio} onChange={e => setForm({...form, dominio: e.target.value})} className="w-full bg-[#0f1219] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-1">Año:</label>
                <input value={form.anio} onChange={e => setForm({...form, anio: e.target.value})} className="w-full bg-[#0f1219] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-1">Marca:</label>
                <select value={form.marca} onChange={e => setForm({...form, marca: e.target.value})} className="w-full bg-[#0f1219] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm">
                  <option value="">Seleccionar...</option>
                  <option>Fiat</option><option>Volkswagen</option><option>Toyota</option><option>Ford</option><option>Chevrolet</option><option>Peugeot</option><option>Renault</option><option>Honda</option><option>Suzuki</option><option>Jeep</option><option>Citroën</option><option>Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-1">N° Chasis:</label>
                <input value={form.chasis} onChange={e => setForm({...form, chasis: e.target.value})} className="w-full bg-[#0f1219] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-1">Modelo:</label>
                <input value={form.modelo} onChange={e => setForm({...form, modelo: e.target.value})} className="w-full bg-[#0f1219] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-1">CC:</label>
                <input value={form.cc} onChange={e => setForm({...form, cc: e.target.value})} className="w-full bg-[#0f1219] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-1">Tipo:</label>
                <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})} className="w-full bg-[#0f1219] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm">
                  <option value="">Seleccionar...</option>
                  <option>Auto</option><option>Camioneta</option><option>Moto</option><option>Camión</option><option>Van</option><option>Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-1">Seguro:</label>
                <input value={form.seguro} onChange={e => setForm({...form, seguro: e.target.value})} className="w-full bg-[#0f1219] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-1">Color:</label>
                <input value={form.color} onChange={e => setForm({...form, color: e.target.value})} className="w-full bg-[#0f1219] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors">Cancelar</button>
              <button onClick={handleSave} disabled={saving || !form.dominio.trim()} className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}