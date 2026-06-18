import { useState } from 'react';
import { ShoppingBag, Search, Plus, Package, TrendingUp } from 'lucide-react';

const products = [
  { id: 1, name: 'Aceite Motor 5W30 4L', category: 'Aceites', price: 12500, stock: 24, image: '🛢️' },
  { id: 2, name: 'Filtro de Aceite Genérico', category: 'Filtros', price: 3200, stock: 45, image: '🔧' },
  { id: 3, name: 'Filtro de Aire', category: 'Filtros', price: 4500, stock: 32, image: '🌬️' },
  { id: 4, name: 'Pastillas de Freno Delanteras', category: 'Frenos', price: 8900, stock: 18, image: '🛑' },
  { id: 5, name: 'Líquido de Frenos DOT4', category: 'Frenos', price: 5200, stock: 28, image: '💧' },
  { id: 6, name: 'Bujías Iridium', category: 'Motor', price: 6800, stock: 40, image: '⚡' },
  { id: 7, name: 'Correa Distribución', category: 'Motor', price: 15600, stock: 12, image: '⚙️' },
  { id: 8, name: 'Refrigerante Radiador 5L', category: 'Refrigeración', price: 7500, stock: 20, image: '❄️' },
];

const categoryColors = {
  Aceites: 'bg-amber-100 text-amber-700',
  Filtros: 'bg-blue-100 text-blue-700',
  Frenos: 'bg-red-100 text-red-700',
  Motor: 'bg-emerald-100 text-emerald-700',
  'Refrigeración': 'bg-cyan-100 text-cyan-700',
};

export default function Tienda() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = ['Todos', ...new Set(products.map(p => p.category))];
  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'Todos' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tienda</h1>
          <p className="text-gray-500 text-sm mt-1">Productos y repuestos</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Producto
        </button>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 mb-5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar producto..."
              className="input-field pl-10"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-primary-200 transition-all">
              <div className="text-3xl mb-3">{p.image}</div>
              <h3 className="font-bold text-gray-800 text-sm">{p.name}</h3>
              <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded mt-1 ${categoryColors[p.category]}`}>
                {p.category}
              </span>
              <div className="flex items-end justify-between mt-3">
                <div>
                  <p className="text-xl font-bold text-primary-600">${p.price.toLocaleString()}</p>
                  <p className={`text-xs font-medium ${p.stock < 15 ? 'text-red-500' : 'text-gray-500'}`}>
                    Stock: {p.stock} unidades
                  </p>
                </div>
                <button className="btn-primary py-1.5 px-3 text-xs">Vender</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
