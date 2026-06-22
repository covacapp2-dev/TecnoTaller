import { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function CuentaCorrientes() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('account_balances')
        .select('*, clients(name)')
        .order('created_at', { ascending: false });

      if (!error) setAccounts(data || []);
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalDebt = accounts.reduce((s, a) => s + Math.abs(Number(a.balance)), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cuenta Corrientes</h1>
          <p className="text-gray-500 text-sm mt-1">Deuda total: <span className="font-bold text-red-600">${totalDebt.toLocaleString()}</span></p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Cliente
        </button>
      </div>

      <div className="card">
        <div className="relative mb-5">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar cliente..."
            className="input-field pl-10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No hay cuentas corrientes ainda</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="text-left px-4 py-3 rounded-l-lg">Cliente</th>
                  <th className="text-left px-4 py-3">Saldo</th>
                  <th className="text-left px-4 py-3">Estado</th>
                  <th className="text-right px-4 py-3 rounded-r-lg">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {accounts.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3.5 text-sm font-medium text-gray-800">{a.clients?.name || '-'}</td>
                    <td className={`px-4 py-3.5 text-sm font-bold ${Number(a.balance) > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      ${Math.abs(Number(a.balance)).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        Number(a.balance) <= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {Number(a.balance) <= 0 ? 'Al día' : 'Con deuda'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button className="text-xs font-medium text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg">
                        Registrar pago
                      </button>
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
