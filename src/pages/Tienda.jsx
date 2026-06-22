import { useState, useEffect } from 'react';
import { Search, Plus, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Tienda() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .eq('active', true)
        .order('name');

      if (!error) setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

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

        {categories.length > 1 && (
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
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No hay productos ainda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map(p => (
              <div key={p.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-primary-200 transition-all">
                <h3 className="font-bold text-gray-800 text-sm">{p.name}</h3>
                <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded mt-1 bg-gray-100 text-gray-600">
                  {p.category}
                </span>
                <div className="flex items-end justify-between mt-3">
                  <div>
                    <p className="text-xl font-bold text-primary-600">${Number(p.price).toLocaleString()}</p>
                    <p className={`text-xs font-medium ${p.stock < p.min_stock ? 'text-red-500' : 'text-gray-500'}`}>
                      Stock: {p.stock} unidades
                    </p>
                  </div>
                  <button className="btn-primary py-1.5 px-3 text-xs">Vender</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
