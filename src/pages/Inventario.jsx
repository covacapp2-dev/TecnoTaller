import { useState, useEffect } from 'react';
import { Search, Plus, Package, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Inventario() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (!error) setItems(data || []);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const lowStock = items.filter(i => i.stock < i.min_stock);

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

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No hay productos en inventario ainda</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="text-left px-4 py-3 rounded-l-lg">Producto</th>
                  <th className="text-left px-4 py-3">Categoría</th>
                  <th className="text-left px-4 py-3">Stock</th>
                  <th className="text-left px-4 py-3">Mínimo</th>
                  <th className="text-right px-4 py-3">Precio</th>
                  <th className="text-right px-4 py-3 rounded-r-lg">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map(i => (
                  <tr key={i.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3.5 text-sm font-medium text-gray-800">{i.name}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{i.category}</td>
                    <td className="px-4 py-3.5 text-sm font-bold text-gray-800">{i.stock}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-500">{i.min_stock}</td>
                    <td className="px-4 py-3.5 text-sm font-medium text-gray-800 text-right">${Number(i.price).toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-right">
                      {i.stock < i.min_stock ? (
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
        )}
      </div>
    </div>
  );
}
