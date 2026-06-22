import { useState, useEffect } from 'react';
import { Car, ClipboardList, DollarSign, Users, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    orders: 0,
    vehicles: 0,
    income: 0,
    clients: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [ordersRes, vehiclesRes, clientsRes, movementsRes] = await Promise.all([
        supabase.from('work_orders').select('*').eq('user_id', user.id),
        supabase.from('vehicles').select('*').eq('user_id', user.id),
        supabase.from('clients').select('*').eq('user_id', user.id),
        supabase.from('cash_movements').select('*').eq('user_id', user.id).eq('type', 'ingreso'),
      ]);

      const activeOrders = (ordersRes.data || []).filter(o => o.status !== 'entregado' && o.status !== 'cancelado');
      const totalIncome = (movementsRes.data || []).reduce((sum, m) => sum + Number(m.amount), 0);

      setStats({
        orders: activeOrders.length,
        vehicles: vehiclesRes.data?.length || 0,
        income: totalIncome,
        clients: clientsRes.data?.length || 0,
      });

      setRecentOrders((ordersRes.data || []).slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    pendiente: 'bg-amber-100 text-amber-700',
    con_turno: 'bg-purple-100 text-purple-700',
    en_progreso: 'bg-blue-100 text-blue-700',
    entregado: 'bg-emerald-100 text-emerald-700',
    cancelado: 'bg-red-100 text-red-700',
  };

  const statusLabels = {
    pendiente: 'Pendiente',
    con_turno: 'Con Turno',
    en_progreso: 'En Progreso',
    entregado: 'Entregado',
    cancelado: 'Cancelado',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Panel de Control</h1>
          <p className="text-gray-500 text-sm mt-1">Bienvenido a TecnoTaller</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-600">{new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Órdenes Activas', value: stats.orders, icon: ClipboardList, color: 'from-blue-500 to-blue-600' },
          { label: 'Vehículos', value: stats.vehicles, icon: Car, color: 'from-cyan-500 to-cyan-600' },
          { label: 'Ingresos del Mes', value: `$${stats.income.toLocaleString()}`, icon: DollarSign, color: 'from-emerald-500 to-emerald-600' },
          { label: 'Clientes', value: stats.clients, icon: Users, color: 'from-violet-500 to-violet-600' },
        ].map((stat) => (
          <div key={stat.label} className="stat-card group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-800">Órdenes Recientes</h2>
            <a href="/taller/ordenes" className="text-sm text-primary-600 font-medium hover:text-primary-700">Ver todas →</a>
          </div>
          {recentOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>No hay órdenes ainda</p>
              <a href="/taller/ordenes" className="text-primary-600 text-sm font-medium mt-2 inline-block">Crear primera orden →</a>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">Orden</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">Vehículo</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">Estado</th>
                    <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 text-sm font-semibold text-primary-600">#{order.order_number}</td>
                      <td className="py-3 text-sm text-gray-500">{order.description || '-'}</td>
                      <td className="py-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                          {statusLabels[order.status]}
                        </span>
                      </td>
                      <td className="py-3 text-sm font-semibold text-gray-800 text-right">${Number(order.total).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-gray-800 mb-5">Accesos Rápidos</h2>
          <div className="space-y-2">
            {[
              { label: 'Nueva Orden', path: '/taller/ordenes', color: 'bg-primary-50 text-primary-700 hover:bg-primary-100' },
              { label: 'Presupuesto', path: '/taller/presupuesto', color: 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100' },
              { label: 'Inventario', path: '/inventario', color: 'bg-violet-50 text-violet-700 hover:bg-violet-100' },
              { label: 'Caja', path: '/caja', color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
            ].map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={`${item.color} rounded-lg px-4 py-3 text-sm font-semibold block transition-colors`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
