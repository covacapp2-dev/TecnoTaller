import { useState } from 'react';
import { Search, Plus, Phone, Mail, User } from 'lucide-react';

const contacts = [
  { id: 1, name: 'Juan Pérez', phone: '11-5555-1234', email: 'juan@email.com', type: 'cliente', vehicles: 2 },
  { id: 2, name: 'María García', phone: '11-6666-5678', email: 'maria@email.com', type: 'cliente', vehicles: 1 },
  { id: 3, name: 'Carlos López', phone: '11-7777-9012', email: 'carlos@email.com', type: 'cliente', vehicles: 3 },
  { id: 4, name: 'Autopartes del Sur', phone: '11-3333-4444', email: 'ventas@autopartes.com', type: 'proveedor', vehicles: 0 },
  { id: 5, name: 'Lubricantes Premium', phone: '11-4444-5555', email: 'info@lubripremium.com', type: 'proveedor', vehicles: 0 },
  { id: 6, name: 'Roberto Sánchez', phone: '11-9999-7890', email: 'roberto@email.com', type: 'cliente', vehicles: 1 },
];

const typeColors = {
  cliente: 'bg-primary-100 text-primary-700',
  proveedor: 'bg-violet-100 text-violet-700',
};

export default function Contactos() {
  const [search, setSearch] = useState('');
  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Contactos</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} contactos</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Contacto
        </button>
      </div>

      <div className="card">
        <div className="relative mb-5">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar contacto..."
            className="input-field pl-10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="text-left px-4 py-3 rounded-l-lg">Nombre</th>
                <th className="text-left px-4 py-3">Teléfono</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Tipo</th>
                <th className="text-left px-4 py-3 rounded-r-lg">Vehículos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-800">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-600">{c.phone}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-600">{c.email}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${typeColors[c.type]}`}>
                      {c.type.charAt(0).toUpperCase() + c.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-500">{c.vehicles}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
