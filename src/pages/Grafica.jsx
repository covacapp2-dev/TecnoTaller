import { useState, useEffect } from 'react';
import { BarChart3, PieChart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Grafica() {
  const { user } = useAuth();
  const [data, setData] = useState({ orders: [], movements: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ordersRes, movementsRes] = await Promise.all([
        supabase.from('work_orders').select('status, total').eq('user_id', user.id),
        supabase.from('cash_movements').select('type, amount, created_at').eq('user_id', user.id),
      ]);

      setData({
        orders: ordersRes.data || [],
        movements: movementsRes.data || [],
      });
    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const ordersByStatus = data.orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const totalIncome = data.movements.filter(m => m.type === 'ingreso').reduce((s, m) => s + Number(m.amount), 0);
  const totalExpense = data.movements.filter(m => m.type === 'egreso').reduce((s, m) => s + Number(m.amount), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Gráficas</h1>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-bold text-gray-800">Órdenes por Estado</h2>
            </div>
            {Object.keys(ordersByStatus).length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No hay datos disponibles</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(ordersByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-24 capitalize">{status.replace('_', ' ')}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-4">
                      <div
                        className="h-4 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full"
                        style={{ width: `${(count / data.orders.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 w-8 text-right">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-5">
              <PieChart className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-bold text-gray-800">Resumen Financiero</h2>
            </div>
            {totalIncome === 0 && totalExpense === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No hay datos disponibles</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <span className="text-sm font-medium text-emerald-700">Ingresos</span>
                  <span className="text-lg font-bold text-emerald-600">${totalIncome.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-sm font-medium text-red-700">Egresos</span>
                  <span className="text-lg font-bold text-red-600">${totalExpense.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                  <span className="text-sm font-medium text-primary-700">Balance</span>
                  <span className="text-lg font-bold text-primary-600">${(totalIncome - totalExpense).toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
