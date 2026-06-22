import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Caja() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('cash_movements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error) setTransactions(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalIngresos = transactions.filter(t => t.type === 'ingreso').reduce((s, t) => s + Number(t.amount), 0);
  const totalEgresos = transactions.filter(t => t.type === 'egreso').reduce((s, t) => s + Number(t.amount), 0);
  const balance = totalIngresos - totalEgresos;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Caja</h1>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Movimiento
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="stat-card border-l-4 border-emerald-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ingresos</p>
              <p className="text-xl font-bold text-emerald-600">${totalIngresos.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="stat-card border-l-4 border-red-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Egresos</p>
              <p className="text-xl font-bold text-red-600">${totalEgresos.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="stat-card border-l-4 border-primary-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Balance</p>
              <p className="text-xl font-bold text-primary-600">${balance.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Movimientos</h2>
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No hay movimientos ainda</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="text-left px-4 py-3 rounded-l-lg">Tipo</th>
                  <th className="text-left px-4 py-3">Descripción</th>
                  <th className="text-left px-4 py-3">Fecha</th>
                  <th className="text-left px-4 py-3">Método</th>
                  <th className="text-right px-4 py-3 rounded-r-lg">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3.5">
                      {t.type === 'ingreso' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <ArrowUpRight className="w-3 h-3" /> Ingreso
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                          <ArrowDownRight className="w-3 h-3" /> Egreso
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-700">{t.description}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-500">{new Date(t.created_at).toLocaleDateString('es-AR')}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-500 capitalize">{t.method}</td>
                    <td className={`px-4 py-3.5 text-sm font-bold text-right ${t.type === 'ingreso' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {t.type === 'ingreso' ? '+' : '-'}${Number(t.amount).toLocaleString()}
                    </td>
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
