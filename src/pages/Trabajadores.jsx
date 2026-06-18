import { useState } from 'react';
import { Search, Plus, UserCheck, Mail, Phone } from 'lucide-react';

const workers = [
  { id: 1, name: 'Carlos Méndez', role: 'Mecánico Principal', phone: '11-5555-0001', email: 'carlos@tecnotaller.com', status: 'activo', orders: 8 },
  { id: 2, name: 'Luis Fernández', role: 'Mecánico', phone: '11-5555-0002', email: 'luis@tecnotaller.com', status: 'activo', orders: 6 },
  { id: 3, name: 'Ana Ruiz', role: 'Recepcionista', phone: '11-5555-0003', email: 'ana@tecnotaller.com', status: 'activo', orders: 0 },
  { id: 4, name: 'Miguel Torres', role: 'Electricista', phone: '11-5555-0004', email: 'miguel@tecnotaller.com', status: 'activo', orders: 4 },
  { id: 5, name: 'Sandra López', role: 'Administrativa', phone: '11-5555-0005', email: 'sandra@tecnotaller.com', status: 'activo', orders: 0 },
];

export default function Trabajadores() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Trabajadores</h1>
          <p className="text-gray-500 text-sm mt-1">{workers.length} empleados activos</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Trabajador
        </button>
      </div>

      <div className="card">
        <div className="relative mb-5">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar trabajador..."
            className="input-field pl-10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workers.map(w => (
            <div key={w.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-primary-200 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {w.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{w.name}</p>
                  <p className="text-xs text-primary-600 font-medium">{w.role}</p>
                </div>
              </div>
              <div className="space-y-1.5 text-sm">
                <p className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-3.5 h-3.5" /> {w.phone}
                </p>
                <p className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-3.5 h-3.5" /> {w.email}
                </p>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <span className="text-xs font-medium text-gray-500">{w.orders} órdenes asignadas</span>
                <span className="inline-flex w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
