import { useState } from 'react';
import { Search, Plus, Package, AlertTriangle } from 'lucide-react';

const items = [
  { id: 1, name: 'Aceite Motor 5W30 4L', category: 'Aceites', stock: 24, minStock: 10, price: 12500, location: 'Estante A1' },
  { id: 2, name: 'Filtro de Aceite Genérico', category: 'Filtros', stock: 45, minStock: 15, price: 3200, location: 'Estante B2' },
  { id: 3, name: 'Filtro de Aire', category: 'Filtros', stock: 32, minStock: 10, price: 4500, location: 'Estante B3' },
  { id: 4, name: 'Pastillas de Freno Delanteras', category: 'Frenos', stock: 8, minStock: 10, price: 8900, location: 'Estante C1' },
  { id: 5, name: 'Líquido de Frenos DOT4', category: 'Frenos', stock: 28, minStock: 12, price: 5200, location: 'Estante C2' },
  { id: 6, name: 'Bujías Iridium', category: 'Motor', stock: 40, minStock: 20, price: 6800, location: 'Estante D1' },
  { id: 7, name: 'Correa Distribución', category: 'Motor', stock: 5, minStock: 8, price: 15600, location: 'Estante D2' },
  { id: 8, name: 'Refrigerante Radiador 5L', category: 'Refrigeración', stock: 20, minStock: 8, price: 7500, location: 'Estante E1' },
  { id: 9, name: 'Vaselina Multpurpose', category: 'Lubricantes', stock: 15, minStock: 10, price: 2800, location: 'Estante F1' },
];

export default function Inventario() {
  const [search, setSearch] = useState('');
  const lowStock = items.filter(i => i.stock < i.minStock);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inventario</h1>
          <p className="text-gray-500 text-sm mt-1">{items.length} productos • {lowStock.length} bajo mínimo</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Producto
        </button>
      </div>

      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Stock bajo detectado</p>
            <p className="text-xs text-amber-600 mt-1">
              {lowStock.map(i => i.name).join(', ')} necesitan reposición
            </p>
          </div>
        </div>
      )}

      <div className="card">
        <div className="relative mb-5">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar producto..."
            className="input-field pl-10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="text-left px-4 py-3 rounded-l-lg">Producto</th>
                <th className="text-left px-4 py-3">Categoría</th>
                <th className="text-left px-4 py-3">Ubicación</th>
                <th className="text-left px-4 py-3">Stock</th>
                <th className="text-left px-4 py-3">Mínimo</th>
                <th className="text-right px-4 py-3">Precio</th>
                <th className="text-right px-4 py-3 rounded-r-lg">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map(i => (
                <tr key={i.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-medium text-gray-800">{i.name}</p>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-600">{i.category}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-500">{i.location}</td>
                  <td className="px-4 py-3.5 text-sm font-bold text-gray-800">{i.stock}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-500">{i.minStock}</td>
                  <td className="px-4 py-3.5 text-sm font-medium text-gray-800 text-right">${i.price.toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-right">
                    {i.stock < i.minStock ? (
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700">Bajo</span>
                    ) : (
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-700">OK</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
