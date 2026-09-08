import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, Plus, Package, X, Trash2, Wrench } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const categorias = ['General', 'Aceites', 'Filtros', 'Frenos', 'Motor', 'Eléctrico', 'Suspensión', 'Transmisión', 'Otros'];
const unidades = ['UNIDAD', 'KG', 'LT', 'MT', 'PAR', 'JUEGO', 'DOCENA'];
const alicuotas = ['0', '10.5', '21'];

export default function Inventario() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [activeTab, setActiveTab] = useState('productos');

  const [newProduct, setNewProduct] = useState({
    code: '', name: '', category: 'General', brand: '', unit_measure: 'UNIDAD',
    model: '', stock: '0', min_stock: '0', supplier: '', price: '0',
    cost: '0', tax: '0', surcharge: '0', bulk_price: '0', description: ''
  });

  const [newService, setNewService] = useState({
    code: '', name: '', category: 'General', check_list: 'NO',
    labor_cost: '0', net_price: '0', surcharge: '0', alicuota: '0',
    bulk_price: '0', description: ''
  });

  const inputClass = "bg-[#0f1219] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-full";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [prodRes, servRes] = await Promise.all([
        supabase.from('products').select('*').eq('user_id', user.id).order('name'),
        supabase.from('services').select('*').eq('user_id', user.id).order('name')
      ]);
      if (!prodRes.error) setItems(prodRes.data || []);
      if (!servRes.error) setServices(servRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    if (!newProduct.name.trim()) return;
    const { data, error } = await supabase.from('products').insert({
      user_id: user.id,
      code: newProduct.code,
      name: newProduct.name,
      category: newProduct.category,
      brand: newProduct.brand,
      model: newProduct.model,
      unit_measure: newProduct.unit_measure,
      stock: parseInt(newProduct.stock) || 0,
      min_stock: parseInt(newProduct.min_stock) || 0,
      supplier: newProduct.supplier,
      price: parseFloat(newProduct.price) || 0,
      cost: parseFloat(newProduct.cost) || 0,
      tax: parseFloat(newProduct.tax) || 0,
      surcharge: parseFloat(newProduct.surcharge) || 0,
      bulk_price: parseFloat(newProduct.bulk_price) || 0,
      description: newProduct.description,
      sku: newProduct.code || null,
    }).select().single();

    if (data) {
      setItems([...items, data]);
      setShowProductModal(false);
      setNewProduct({ code: '', name: '', category: 'General', brand: '', unit_measure: 'UNIDAD', model: '', stock: '0', min_stock: '0', supplier: '', price: '0', cost: '0', tax: '0', surcharge: '0', bulk_price: '0', description: '' });
    }
  };

  const handleCreateService = async () => {
    if (!newService.name.trim()) return;
    const { data, error } = await supabase.from('services').insert({
      user_id: user.id,
      code: newService.code,
      name: newService.name,
      category: newService.category,
      check_list: newService.check_list,
      labor_cost: parseFloat(newService.labor_cost) || 0,
      net_price: parseFloat(newService.net_price) || 0,
      surcharge: parseFloat(newService.surcharge) || 0,
      alicuota: parseFloat(newService.alicuota) || 0,
      bulk_price: parseFloat(newService.bulk_price) || 0,
      description: newService.description,
    }).select().single();

    if (data) {
      setServices([...services, data]);
      setShowServiceModal(false);
      setNewService({ code: '', name: '', category: 'General', check_list: 'NO', labor_cost: '0', net_price: '0', surcharge: '0', alicuota: '0', bulk_price: '0', description: '' });
    }
  };

  const deleteItem = async (id) => {
    await supabase.from('products').delete().eq('id', id);
    setItems(items.filter(i => i.id !== id));
  };

  const deleteService = async (id) => {
    await supabase.from('services').delete().eq('id', id);
    setServices(services.filter(s => s.id !== id));
  };

  const filteredItems = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.code || '').toLowerCase().includes(search.toLowerCase()) ||
    (i.brand || '').toLowerCase().includes(search.toLowerCase())
  );

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.code || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full bg-[#0f1219] p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h1 className="text-xl font-bold text-white">Inventario</h1>
        <div className="flex gap-2">
          <button onClick={() => { setShowServiceModal(true); setNewService({ code: '', name: '', category: 'General', check_list: 'NO', labor_cost: '0', net_price: '0', surcharge: '0', alicuota: '0', bulk_price: '0', description: '' }); }} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
            <Wrench className="w-4 h-4" />
            Agregar Servicio
          </button>
          <button onClick={() => { setShowProductModal(true); setNewProduct({ code: '', name: '', category: 'General', brand: '', unit_measure: 'UNIDAD', model: '', stock: '0', min_stock: '0', supplier: '', price: '0', cost: '0', tax: '0', surcharge: '0', bulk_price: '0', description: '' }); }} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />
            Cargar Productos
          </button>
        </div>
      </div>

      <div className="bg-[#1a1f2e] border border-gray-700 rounded-xl p-4 flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-4 mb-4 flex-shrink-0">
          <div className="flex bg-[#0f1219] rounded-lg p-1">
            <button onClick={() => setActiveTab('productos')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'productos' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'}`}>Productos ({items.length})</button>
            <button onClick={() => setActiveTab('servicios')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'servicios' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>Servicios ({services.length})</button>
          </div>
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="text" placeholder="Buscar..." className={inputClass + " pl-10"} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        ) : activeTab === 'productos' ? (
          filteredItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">{items.length === 0 ? 'No hay productos aún' : 'Sin resultados'}</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Nombre</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">ID</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Código</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Marca</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Modelo</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Proveedor</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Stock</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Precio</th>
                    <th className="text-right py-2 px-3 text-xs font-medium text-gray-400"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map(i => (
                    <tr key={i.id} className="border-b border-gray-700/50 hover:bg-[#222839] transition-colors">
                      <td className="py-3 px-3 text-white font-medium">{i.name}</td>
                      <td className="py-3 px-3 text-gray-500 text-xs">{i.id?.substring(0, 8)}...</td>
                      <td className="py-3 px-3 text-gray-400">{i.code || i.sku || '-'}</td>
                      <td className="py-3 px-3 text-gray-400">{i.brand || '-'}</td>
                      <td className="py-3 px-3 text-gray-400">{i.model || '-'}</td>
                      <td className="py-3 px-3 text-gray-400">{i.supplier || '-'}</td>
                      <td className="py-3 px-3">
                        <span className={`font-medium ${i.stock < i.min_stock ? 'text-red-400' : 'text-white'}`}>{i.stock}</span>
                      </td>
                      <td className="py-3 px-3 text-gray-400">${Number(i.price).toLocaleString()}</td>
                      <td className="py-3 px-3 text-right">
                        <button onClick={() => deleteItem(i.id)} className="text-red-400 hover:text-red-300 p-1"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          filteredServices.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Wrench className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">{services.length === 0 ? 'No hay servicios aún' : 'Sin resultados'}</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Nombre</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Código</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Categoría</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Costo Mano Obra</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Precio Neto</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Precio Bruto</th>
                    <th className="text-right py-2 px-3 text-xs font-medium text-gray-400"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map(s => (
                    <tr key={s.id} className="border-b border-gray-700/50 hover:bg-[#222839] transition-colors">
                      <td className="py-3 px-3 text-white font-medium">{s.name}</td>
                      <td className="py-3 px-3 text-gray-400">{s.code || '-'}</td>
                      <td className="py-3 px-3 text-gray-400">{s.category}</td>
                      <td className="py-3 px-3 text-gray-400">${Number(s.labor_cost).toLocaleString()}</td>
                      <td className="py-3 px-3 text-gray-400">${Number(s.net_price).toLocaleString()}</td>
                      <td className="py-3 px-3 text-gray-400">${Number(s.bulk_price).toLocaleString()}</td>
                      <td className="py-3 px-3 text-right">
                        <button onClick={() => deleteService(s.id)} className="text-red-400 hover:text-red-300 p-1"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {showProductModal && createPortal(
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4" onClick={() => setShowProductModal(false)}>
          <div className="bg-[#1a1f2e] border border-gray-700 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-700 sticky top-0 bg-[#1a1f2e] z-10">
              <h2 className="text-lg font-bold text-white">Cargar Producto</h2>
              <button onClick={() => setShowProductModal(false)} className="text-gray-400 hover:text-white p-1"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Código</label>
                  <input type="text" className={inputClass} placeholder="Código adicional" value={newProduct.code} onChange={e => setNewProduct({ ...newProduct, code: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Categoría</label>
                  <select className={inputClass} value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                    {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Nombre *</label>
                  <input type="text" className={inputClass} value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Unidad medida</label>
                  <select className={inputClass} value={newProduct.unit_measure} onChange={e => setNewProduct({ ...newProduct, unit_measure: e.target.value })}>
                    {unidades.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Marca</label>
                  <input type="text" className={inputClass} value={newProduct.brand} onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Stock *</label>
                  <input type="number" className={inputClass} value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Modelo</label>
                  <input type="text" className={inputClass} value={newProduct.model} onChange={e => setNewProduct({ ...newProduct, model: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Stock mínimo</label>
                  <input type="number" className={inputClass} value={newProduct.min_stock} onChange={e => setNewProduct({ ...newProduct, min_stock: e.target.value })} />
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400">Proveedor</label>
                    <input type="text" className={inputClass} value={newProduct.supplier} onChange={e => setNewProduct({ ...newProduct, supplier: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400">Precio Venta *</label>
                    <input type="number" step="0.01" className={inputClass} value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400">Costo compra</label>
                    <input type="number" step="0.01" className={inputClass} value={newProduct.cost} onChange={e => setNewProduct({ ...newProduct, cost: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400">Impuesto *</label>
                    <select className={inputClass} value={newProduct.tax} onChange={e => setNewProduct({ ...newProduct, tax: e.target.value })}>
                      {alicuotas.map(a => <option key={a} value={a}>{a}%</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400">Recargo (%)</label>
                    <input type="number" step="0.01" className={inputClass} value={newProduct.surcharge} onChange={e => setNewProduct({ ...newProduct, surcharge: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400">Precio Bruto</label>
                    <input type="number" step="0.01" className={inputClass} value={newProduct.bulk_price} onChange={e => setNewProduct({ ...newProduct, bulk_price: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-400">Descripción</label>
                <textarea className={inputClass + " resize-none"} rows={2} value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowProductModal(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 py-2.5 rounded-lg text-sm font-medium transition-colors">Cancelar</button>
                <button onClick={handleCreateProduct} disabled={!newProduct.name.trim()} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">Guardar</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showServiceModal && createPortal(
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4" onClick={() => setShowServiceModal(false)}>
          <div className="bg-[#1a1f2e] border border-gray-700 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-700 sticky top-0 bg-[#1a1f2e] z-10">
              <h2 className="text-lg font-bold text-white">Agregar Servicio</h2>
              <button onClick={() => setShowServiceModal(false)} className="text-gray-400 hover:text-white p-1"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Código</label>
                  <input type="text" className={inputClass} placeholder="Automático" value={newService.code} onChange={e => setNewService({ ...newService, code: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Categoría</label>
                  <select className={inputClass} value={newService.category} onChange={e => setNewService({ ...newService, category: e.target.value })}>
                    {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Servicio *</label>
                  <input type="text" className={inputClass} value={newService.name} onChange={e => setNewService({ ...newService, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Check List</label>
                  <select className={inputClass} value={newService.check_list} onChange={e => setNewService({ ...newService, check_list: e.target.value })}>
                    <option>NO</option><option>SI</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400">Costo mano obra</label>
                    <input type="number" step="0.01" className={inputClass} value={newService.labor_cost} onChange={e => setNewService({ ...newService, labor_cost: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400">Precio Neto *</label>
                    <input type="number" step="0.01" className={inputClass} value={newService.net_price} onChange={e => setNewService({ ...newService, net_price: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400">Remarque precio (%)</label>
                    <input type="number" step="0.01" className={inputClass} value={newService.surcharge} onChange={e => setNewService({ ...newService, surcharge: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400">Alicuota</label>
                    <select className={inputClass} value={newService.alicuota} onChange={e => setNewService({ ...newService, alicuota: e.target.value })}>
                      {alicuotas.map(a => <option key={a} value={a}>{a}%</option>)}
                    </select>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <label className="text-xs text-gray-400">Precio Bruto</label>
                  <input type="number" step="0.01" className={inputClass} value={newService.bulk_price} onChange={e => setNewService({ ...newService, bulk_price: e.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-400">Descripción</label>
                <textarea className={inputClass + " resize-none"} rows={2} value={newService.description} onChange={e => setNewService({ ...newService, description: e.target.value })} />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowServiceModal(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 py-2.5 rounded-lg text-sm font-medium transition-colors">Cancelar</button>
                <button onClick={handleCreateService} disabled={!newService.name.trim()} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">Guardar</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}