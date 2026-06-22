import { useState, useEffect } from 'react';
import { FileText, Download, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Informes() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ orders: 0, income: 0, clients: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [ordersRes, movementsRes, clientsRes] = await Promise.all([
        supabase.from('work_orders').select('*').eq('user_id', user.id),
        supabase.from('cash_movements').select('amount').eq('user_id', user.id).eq('type', 'ingreso'),
        supabase.from('clients').select('*').eq('user_id', user.id),
      ]);

      const completedOrders = (ordersRes.data || []).filter(o => o.status === 'entregado');
      const totalIncome = (movementsRes.data || []).reduce((s, m) => s + Number(m.amount), 0);

      setStats({
        orders: completedOrders.length,
        income: totalIncome,
        clients: clientsRes.data?.length || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const reports = [
    { title: 'Órdenes Completadas', value: stats.orders, type: 'operaciones' },
    { title: 'Facturación Total', value: `$${stats.income.toLocaleString()}`, type: 'financiero' },
    { title: 'Total Clientes', value: stats.clients, type: 'clientes' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Informes</h1>
        <button className="btn-primary flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Generar Informe
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {reports.map((r, i) => (
              <div key={i} className={`stat-card border-l-4 ${
                r.type === 'financiero' ? 'border-emerald-500' :
                r.type === 'operaciones' ? 'border-primary-500' : 'border-violet-500'
              }`}>
                <p className="text-sm text-gray-500">{r.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{r.value}</p>
              </div>
            ))}
          </div>

          <div className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Resumen General</h2>
            {stats.orders === 0 && stats.income === 0 && stats.clients === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>No hay datos para generar informes ainda</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Órdenes completadas</span>
                  <span className="font-bold text-gray-800">{stats.orders}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Facturación total</span>
                  <span className="font-bold text-emerald-600">${stats.income.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Total clientes</span>
                  <span className="font-bold text-gray-800">{stats.clients}</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
