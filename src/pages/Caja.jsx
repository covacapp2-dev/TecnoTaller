import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const operaciones = [
  'Órdenes de reparación',
  'Ventas',
  'Compras',
  'Movimientos de caja',
  'Cobros de cuentas corrientes',
  'Pagos a trabajadores',
];

export default function Caja() {
  const { user } = useAuth();
  const [cajaAbierta, setCajaAbierta] = useState(false);
  const [montoInicial, setMontoInicial] = useState('');
  const [showAbrirModal, setShowAbrirModal] = useState(false);
  const [showCerrarModal, setShowCerrarModal] = useState(false);
  const [showMovimientoModal, setShowMovimientoModal] = useState(false);
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadCaja(); }, []);

  const loadCaja = async () => {
    try {
      const { data } = await supabase
        .from('cash_register')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'abierta')
        .order('opened_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setCajaAbierta(true);
        loadMovimientos(data.id);
      }
    } catch (e) {
      console.error('Error loading caja:', e);
    } finally {
      setLoading(false);
    }
  };

  const loadMovimientos = async (registerId) => {
    const { data } = await supabase
      .from('cash_movements')
      .select('*')
      .eq('register_id', registerId)
      .order('created_at', { ascending: true });
    setMovimientos(data || []);
  };

  const abrirCaja = async () => {
    if (!montoInicial) return;
    const { data, error } = await supabase.from('cash_register').insert({
      user_id: user.id,
      opening_amount: Number(montoInicial),
      status: 'abierta',
    }).select().single();

    if (!error && data) {
      setCajaAbierta(true);
      setShowAbrirModal(false);
      setMontoInicial('');
    }
  };

  const cerrarCaja = async () => {
    const { data } = await supabase
      .from('cash_register')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'abierta')
      .limit(1)
      .single();

    if (data) {
      await supabase.from('cash_register').update({ status: 'cerrada', closed_at: new Date().toISOString() }).eq('id', data.id);
      setCajaAbierta(false);
      setShowCerrarModal(false);
      setMovimientos([]);
    }
  };

  const totales = operaciones.map(op => {
    const movs = movimientos.filter(m => m.category === op);
    const efectivo = movs.filter(m => m.method === 'efectivo').reduce((s, m) => s + Number(m.amount), 0);
    const otros = movs.filter(m => m.method !== 'efectivo').reduce((s, m) => s + Number(m.amount), 0);
    return { operacion: op, efectivo, otros, total: efectivo + otros };
  });

  const totalEfectivo = totales.reduce((s, t) => s + t.efectivo, 0);
  const totalOtros = totales.reduce((s, t) => s + t.otros, 0);
  const totalGeneral = totalEfectivo + totalOtros;

  if (loading) {
    return <div className="h-full bg-[#0f1219] flex items-center justify-center"><span className="text-gray-500">Cargando...</span></div>;
  }

  return (
    <div className="h-full bg-[#0f1219] p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h1 className="text-xl font-bold text-white">Caja</h1>
        {cajaAbierta ? (
          <button onClick={() => setShowMovimientoModal(true)} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Carga de movimiento
          </button>
        ) : (
          <button onClick={() => setShowAbrirModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Abrir Caja
          </button>
        )}
      </div>

      {cajaAbierta && (
        <div className="mb-4 flex-shrink-0">
          <button onClick={() => setShowCerrarModal(true)} className="w-full bg-[#1a1f2e] border border-gray-700/50 rounded-xl py-4 flex items-center justify-center hover:bg-[#222839] transition-colors cursor-pointer">
            <span className="text-emerald-400 font-bold text-sm tracking-widest uppercase">CERRAR CAJA</span>
          </button>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <div className="bg-[#1a1f2e] border border-gray-700/50 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#151a26]">
              <tr className="text-gray-400 text-left text-xs uppercase">
                <th className="px-4 py-3 font-medium">Operación</th>
                <th className="px-4 py-3 font-medium text-right">Efectivo</th>
                <th className="px-4 py-3 font-medium text-right">Otros</th>
                <th className="px-4 py-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {totales.map((t, i) => (
                <tr key={i} className="border-t border-gray-700/30 text-gray-300">
                  <td className="px-4 py-3">{t.operacion}</td>
                  <td className="px-4 py-3 text-right">${t.efectivo.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">${t.otros.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">${t.total.toLocaleString()}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-gray-600 font-bold">
                <td className="px-4 py-3 text-white">Totales:</td>
                <td className="px-4 py-3 text-right text-emerald-400">${totalEfectivo.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-emerald-400">${totalOtros.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-emerald-400">${totalGeneral.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {showAbrirModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowAbrirModal(false)}>
          <div className="bg-[#1a1f2e] border border-gray-700 rounded-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white mb-4">Abrir Caja</h2>
            <label className="block text-gray-400 text-xs font-medium mb-1">Monto inicial</label>
            <input
              type="number"
              value={montoInicial}
              onChange={e => setMontoInicial(e.target.value)}
              placeholder="0"
              className="w-full bg-[#0f1219] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowAbrirModal(false)} className="px-4 py-2 text-gray-400 hover:text-white text-sm">Cancelar</button>
              <button onClick={abrirCaja} disabled={!montoInicial} className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-medium">Abrir</button>
            </div>
          </div>
        </div>
      )}

      {showCerrarModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowCerrarModal(false)}>
          <div className="bg-[#1a1f2e] border border-gray-700 rounded-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white mb-2">Cerrar Caja</h2>
            <p className="text-gray-400 text-sm mb-4">¿Estás seguro que querés cerrar la caja?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowCerrarModal(false)} className="px-4 py-2 text-gray-400 hover:text-white text-sm">Cancelar</button>
              <button onClick={cerrarCaja} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-medium">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {showMovimientoModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowMovimientoModal(false)}>
          <div className="bg-[#1a1f2e] border border-gray-700 rounded-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white mb-4">Carga de movimiento</h2>
            <p className="text-gray-400 text-sm">Seleccioná el tipo de movimiento a cargar:</p>
            <div className="mt-4 space-y-2">
              {['Venta de producto', 'Venta de servicio'].map(tipo => (
                <button key={tipo} className="w-full bg-[#0f1219] border border-gray-600 hover:border-primary-500 rounded-lg px-4 py-3 text-left text-white text-sm transition-colors">
                  {tipo}
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={() => setShowMovimientoModal(false)} className="px-4 py-2 text-gray-400 hover:text-white text-sm">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}