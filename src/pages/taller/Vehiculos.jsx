import { useState } from 'react';
import { Search, Plus, Car, Filter, Eye, Edit2 } from 'lucide-react';

const vehicles = [
  { id: 1, brand: 'Toyota', model: 'Corolla', year: 2020, patente: 'ABC-1234', client: 'Juan Pérez', color: 'Gris', km: 45000, lastService: '15/06/2024' },
  { id: 2, brand: 'Ford', model: 'Fiesta', year: 2019, patente: 'XYZ-5678', client: 'María García', color: 'Blanco', km: 62000, lastService: '10/06/2024' },
  { id: 3, brand: 'Chevrolet', model: 'Onix', year: 2021, patente: 'DEF-9012', client: 'Carlos López', color: 'Negro', km: 28000, lastService: '01/06/2024' },
  { id: 4, brand: 'Volkswagen', model: 'Gol', year: 2018, patente: 'GHI-3456', client: 'Ana Martínez', color: 'Rojo', km: 78000, lastService: '20/05/2024' },
  { id: 5, brand: 'Honda', model: 'Civic', year: 2022, patente: 'JKL-7890', client: 'Roberto Sánchez', color: 'Azul', km: 15000, lastService: '12/06/2024' },
  { id: 6, brand: 'Peugeot', model: '208', year: 2021, patente: 'MNO-2345', client: 'Laura Díaz', color: 'Plata', km: 33000, lastService: '08/06/2024' },
];

const brandColors = {
  Toyota: 'bg-red-100 text-red-700',
  Ford: 'bg-blue-100 text-blue-700',
  Chevrolet: 'bg-yellow-100 text-yellow-700',
  Volkswagen: 'bg-slate-100 text-slate-700',
  Honda: 'bg-emerald-100 text-emerald-700',
  Peugeot: 'bg-indigo-100 text-indigo-700',
};

export default function Vehiculos() {
  const [search, setSearch] = useState('');

  const filtered = vehicles.filter(v =>
    `${v.brand} ${v.model} ${v.patente} ${v.client}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Vehículos</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} vehículos registrados</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Vehículo
        </button>
      </div>

      <div className="card">
        <div className="relative mb-5">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por marca, modelo, patente o cliente..."
            className="input-field pl-10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(v => (
            <div key={v.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-primary-200 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
                    <Car className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{v.brand} {v.model}</p>
                    <p className="text-xs text-gray-400">{v.year} • {v.color}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${brandColors[v.brand] || 'bg-gray-100 text-gray-600'}`}>
                  {v.patente}
                </span>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Cliente</span>
                  <span className="font-medium text-gray-700">{v.client}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Kilometraje</span>
                  <span className="font-medium text-gray-700">{v.km.toLocaleString()} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Último servicio</span>
                  <span className="font-medium text-gray-700">{v.lastService}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                <button className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-primary-600 hover:bg-primary-50 py-1.5 rounded-lg transition-colors">
                  <Eye className="w-3.5 h-3.5" /> Ver
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-gray-600 hover:bg-gray-100 py-1.5 rounded-lg transition-colors">
                  <Edit2 className="w-3.5 h-3.5" /> Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
