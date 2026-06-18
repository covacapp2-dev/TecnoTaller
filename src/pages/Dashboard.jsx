import { Car, ClipboardList, DollarSign, TrendingUp, Users, AlertCircle, Clock, CheckCircle } from 'lucide-react';

const stats = [
  { label: 'Órdenes Activas', value: '12', icon: ClipboardList, color: 'from-blue-500 to-blue-600', change: '+3 hoy' },
  { label: 'Vehículos', value: '48', icon: Car, color: 'from-cyan-500 to-cyan-600', change: '+2 esta semana' },
  { label: 'Ingresos del Mes', value: '$2.450.000', icon: DollarSign, color: 'from-emerald-500 to-emerald-600', change: '+18%' },
  { label: 'Clientes', value: '156', icon: Users, color: 'from-violet-500 to-violet-600', change: '+8 nuevos' },
];

const recentOrders = [
  { id: '#00145', client: 'Juan Pérez', vehicle: 'Toyota Corolla 2020', status: 'en_progreso', statusLabel: 'En Progreso', date: '18/06/2024', total: '$185.000' },
  { id: '#00144', client: 'María García', vehicle: 'Ford Fiesta 2019', status: 'pendiente', statusLabel: 'Pendiente', date: '18/06/2024', total: '$92.000' },
  { id: '#00143', client: 'Carlos López', vehicle: 'Chevrolet Onix 2021', status: 'entregado', statusLabel: 'Entregado', date: '17/06/2024', total: '$245.000' },
  { id: '#00142', client: 'Ana Martínez', vehicle: 'Volkswagen Gol 2018', status: 'con_turno', statusLabel: 'Con Turno', date: '17/06/2024', total: '$67.000' },
  { id: '#00141', client: 'Roberto Sánchez', vehicle: 'Honda Civic 2022', status: 'entregado', statusLabel: 'Entregado', date: '16/06/2024', total: '$320.000' },
];

const statusColors = {
  en_progreso: 'bg-blue-100 text-blue-700',
  pendiente: 'bg-amber-100 text-amber-700',
  entregado: 'bg-emerald-100 text-emerald-700',
  con_turno: 'bg-purple-100 text-purple-700',
  pago_pendiente: 'bg-red-100 text-red-700',
};

const alerts = [
  { type: 'warning', text: '3 órdenes con pago pendiente', icon: AlertCircle },
  { type: 'info', text: '2 turnos programados para mañana', icon: Clock },
  { type: 'success', text: 'Inventario actualizado: 5 productos bajos', icon: CheckCircle },
];

export default function Dashboard() {
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
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                <p className="text-xs text-emerald-600 mt-1 font-medium">{stat.change}</p>
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">Orden</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">Cliente</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">Vehículo</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">Estado</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 text-sm font-semibold text-primary-600">{order.id}</td>
                    <td className="py-3 text-sm text-gray-700">{order.client}</td>
                    <td className="py-3 text-sm text-gray-500">{order.vehicle}</td>
                    <td className="py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                        {order.statusLabel}
                      </span>
                    </td>
                    <td className="py-3 text-sm font-semibold text-gray-800 text-right">{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-gray-800 mb-5">Alertas</h2>
          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${
                alert.type === 'warning' ? 'bg-amber-50 border border-amber-200' :
                alert.type === 'info' ? 'bg-blue-50 border border-blue-200' :
                'bg-emerald-50 border border-emerald-200'
              }`}>
                <alert.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                  alert.type === 'warning' ? 'text-amber-600' :
                  alert.type === 'info' ? 'text-blue-600' :
                  'text-emerald-600'
                }`} />
                <p className="text-sm text-gray-700">{alert.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Accesos Rápidos</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Nueva Orden', path: '/taller/ordenes', color: 'bg-primary-50 text-primary-700 hover:bg-primary-100' },
                { label: 'Presupuesto', path: '/taller/presupuesto', color: 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100' },
                { label: 'Inventario', path: '/inventario', color: 'bg-violet-50 text-violet-700 hover:bg-violet-100' },
                { label: 'Caja', path: '/caja', color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
              ].map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  className={`${item.color} rounded-lg px-3 py-2 text-xs font-semibold text-center transition-colors`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
