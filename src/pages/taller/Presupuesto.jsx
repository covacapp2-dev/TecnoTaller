import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, Plus, X, Printer, Copy, Mail, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const conceptos = ['REPARACIÓN', 'MANTENIMIENTO', 'INSPECCIÓN', 'OTRO'];
const itemTipos = ['Servicio', 'Repuesto'];

const emptyItem = { description: '', amount: 0, quantity: 1, type: 'Servicio', discount: 0, sku: '' };

export default function Presupuesto() {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [clients, setClients] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [concepto, setConcepto] = useState('REPARACIÓN');
  const [kilometraje, setKilometraje] = useState('');
  const [numInspector, setNumInspector] = useState('');
  const [numSiniestro, setNumSiniestro] = useState('');
  const [franquicia, setFranquicia] = useState('');
  const [items, setItems] = useState([{ ...emptyItem }]);
  const [descuento, setDescuento] = useState(0);
  const [observaciones, setObservaciones] = useState('');
  const [comentarioInterno, setComentarioInterno] = useState('');
  const [saving, setSaving] = useState(false);
  const [searchClient, setSearchClient] = useState('');
  const [searchVehicle, setSearchVehicle] = useState('');
  const [showClientPicker, setShowClientPicker] = useState(false);
  const [showVehiclePicker, setShowVehiclePicker] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientDni, setNewClientDni] = useState('');
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientForm, setClientForm] = useState({ name: '', fantasy_name: '', dni: '', doc_type: 'DNI', tipo_responsable: 'Consumidor Final', domicilio: '', phone: '', phone_alt: '', email: '', email_alt: '', contact_person: '', notes: '' });
  const [newVehicleBrand, setNewVehicleBrand] = useState('');
  const [newVehicleModel, setNewVehicleModel] = useState('');
  const [newVehiclePatente, setNewVehiclePatente] = useState('');

  useEffect(() => { loadBudgets(); }, []);

  const loadBudgets = async () => {
    try {
      const { data } = await supabase.from('budgets')
        .select('*, clients(name), vehicles(brand, model, patente)')
        .eq('user_id', user.id).order('created_at', { ascending: false });
      setBudgets(data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const openForm = async () => {
    setShowForm(true);
    const { data: c } = await supabase.from('clients').select('id, name, phone, email').eq('user_id', user.id).order('name');
    setClients(c || []);
  };

  const loadVehicles = async (clientId) => {
    const { data } = await supabase.from('vehicles').select('id, brand, model, patente, color').eq('client_id', clientId).order('brand');
    setVehicles(data || []);
  };

  const selectClient = (c) => { setSelectedClient(c); setShowClientPicker(false); loadVehicles(c.id); setSelectedVehicle(null); };
  const selectVehicle = (v) => { setSelectedVehicle(v); setShowVehiclePicker(false); };

  const addClient = async () => {
    if (!clientForm.name.trim()) return;
    const { data } = await supabase.from('clients').insert({
      user_id: user.id, name: clientForm.name, phone: clientForm.phone, email: clientForm.email, notes: clientForm.notes,
      address: clientForm.domicilio,
    }).select().single();
    if (data) { setClients([...clients, data]); setSelectedClient(data); setShowClientPicker(false); setShowClientModal(false); setClientForm({ name: '', fantasy_name: '', dni: '', doc_type: 'DNI', tipo_responsable: 'Consumidor Final', domicilio: '', phone: '', phone_alt: '', email: '', email_alt: '', contact_person: '', notes: '' }); }
  };

  const addVehicle = async () => {
    if (!newVehicleBrand.trim() || !selectedClient) return;
    const { data } = await supabase.from('vehicles').insert({ user_id: user.id, client_id: selectedClient.id, brand: newVehicleBrand, model: newVehicleModel, patente: newVehiclePatente }).select().single();
    if (data) { setVehicles([...vehicles, data]); setSelectedVehicle(data); setShowVehiclePicker(false); setNewVehicleBrand(''); setNewVehicleModel(''); setNewVehiclePatente(''); }
  };

  const updateItem = (i, field, val) => {
    const copy = [...items];
    copy[i] = { ...copy[i], [field]: val };
    setItems(copy);
  };
  const addItem = () => setItems([...items, { ...emptyItem }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));

  const totals = items.reduce((acc, it) => {
    const sub = it.amount * it.quantity * (1 - (it.discount || 0) / 100);
    const iva = sub * 0.21;
    acc.subtotal += sub;
    acc.iva += iva;
    return acc;
  }, { subtotal: 0, iva: 0 });

  const totalNeto = totals.subtotal - (descuento || 0);
  const totalIVA = totals.iva;
  const totalGeneral = totalNeto + totalIVA;

  const handleSave = async () => {
    setSaving(true);
    const { data: budget } = await supabase.from('budgets').insert({
      user_id: user.id, client_id: selectedClient?.id || null, vehicle_id: selectedVehicle?.id || null,
      description: concepto, total: totalGeneral, status: 'borrador',
    }).select().single();

    if (budget) {
      const budgetItems = items.filter(it => it.description.trim()).map(it => ({
        budget_id: budget.id, description: it.description, type: it.type.toLowerCase() === 'repuesto' ? 'repuesto' : 'servicio',
        quantity: it.quantity, unit_price: it.amount,
      }));
      if (budgetItems.length) await supabase.from('budget_items').insert(budgetItems);
    }
    setSaving(false);
    setShowForm(false);
    loadBudgets();
  };

  const inputClass = "w-full bg-[#0f1219] border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-primary-500";
  const inputSmall = "bg-[#0f1219] border border-gray-600 rounded px-2 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-primary-500";

  return (
    <div className="h-full bg-[#0f1219] p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Presupuesto</h1>
        <button onClick={openForm} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors">
          <Plus className="w-4 h-4" /> Nuevo
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto"></div>
        </div>
      ) : budgets.length === 0 ? (
        <div className="text-center py-16 text-gray-500 text-sm">No hay presupuestos</div>
      ) : (
        <div className="bg-[#1a1f2e] border border-gray-700/50 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Estado</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Cliente</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Vehículo</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Presupuesto</th>
                <th className="text-right px-4 py-3 text-gray-400 font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {budgets.map(b => (
                <tr key={b.id} className="hover:bg-[#222839] transition-colors cursor-pointer">
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      b.status === 'aprobado' ? 'bg-emerald-500/20 text-emerald-400' :
                      b.status === 'enviado' ? 'bg-blue-500/20 text-blue-400' :
                      b.status === 'rechazado' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>{b.status.charAt(0).toUpperCase() + b.status.slice(1)}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{b.clients?.name || '-'}</td>
                  <td className="px-4 py-3 text-gray-300">{b.vehicles ? `${b.vehicles.brand} ${b.vehicles.model}` : '-'}</td>
                  <td className="px-4 py-3 text-primary-400 font-semibold">#{b.budget_number}</td>
                  <td className="px-4 py-3 text-right font-bold text-white">${Number(b.total).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && createPortal(
        <div className="fixed inset-0 bg-black/70 flex items-start justify-center z-[9999] p-4 pt-8 overflow-y-auto" onClick={() => setShowForm(false)}>
          <div className="bg-[#1a1f2e] border border-gray-700 rounded-2xl w-full max-w-4xl shadow-2xl mb-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-lg font-bold text-white">Presupuesto</h2>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"><Printer className="w-3.5 h-3.5" /> Imprimir</button>
                <button className="flex items-center gap-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"><Copy className="w-3.5 h-3.5" /> Copiar</button>
                <button className="flex items-center gap-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"><Mail className="w-3.5 h-3.5" /> Correo</button>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white p-1 ml-2"><X className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Fecha emisión</label>
                  <input type="datetime-local" className={inputClass} defaultValue={new Date().toISOString().slice(0, 16)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-400 w-24">Buscar cliente</label>
                    <div className="flex-1 relative">
                      <input type="text" placeholder="Nombre del cliente..." className={inputClass} value={searchClient} onChange={e => { setSearchClient(e.target.value); if (e.target.value) setShowClientPicker(true); }} onFocus={() => setShowClientPicker(true)} />
                      {showClientPicker && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-[#0f1219] border border-gray-600 rounded-lg shadow-xl z-50 max-h-40 overflow-y-auto">
                          {clients.filter(c => c.name.toLowerCase().includes(searchClient.toLowerCase())).map(c => (
                            <button key={c.id} onClick={() => { selectClient(c); setSearchClient(c.name); }} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-[#222839]">{c.name}</button>
                          ))}
                          {clients.filter(c => c.name.toLowerCase().includes(searchClient.toLowerCase())).length === 0 && (
                            <div className="px-3 py-2 text-sm text-gray-500">Sin resultados</div>
                          )}
                        </div>
                      )}
                    </div>
                    <button onClick={() => setShowClientModal(true)} className="bg-primary-600 hover:bg-primary-700 text-white p-1.5 rounded-lg transition-colors"><Plus className="w-4 h-4" /></button>
                  </div>
                  {selectedClient && (
                    <div className="flex gap-4 ml-26 text-xs text-gray-400">
                      <span>DNI: {selectedClient.email || '-'}</span>
                      <span>Tel: {selectedClient.phone || '-'}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-400 w-24">Buscar vehículo</label>
                    <div className="flex-1 relative">
                      <input type="text" placeholder="Vehículo..." className={inputClass} value={searchVehicle} onChange={e => { setSearchVehicle(e.target.value); if (e.target.value) setShowVehiclePicker(true); }} onFocus={() => { if (selectedClient) setShowVehiclePicker(true); }} disabled={!selectedClient} />
                      {showVehiclePicker && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-[#0f1219] border border-gray-600 rounded-lg shadow-xl z-50 max-h-40 overflow-y-auto">
                          {vehicles.filter(v => `${v.brand} ${v.model} ${v.patente}`.toLowerCase().includes(searchVehicle.toLowerCase())).map(v => (
                            <button key={v.id} onClick={() => { selectVehicle(v); setSearchVehicle(`${v.brand} ${v.model} (${v.patente})`); }} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-[#222839]">{v.brand} {v.model} ({v.patente})</button>
                          ))}
                          <div className="border-t border-gray-700 p-2">
                            <input type="text" placeholder="Marca..." className={inputSmall + " w-full mb-1"} value={newVehicleBrand} onChange={e => setNewVehicleBrand(e.target.value)} />
                            <div className="flex gap-1">
                              <input type="text" placeholder="Modelo" className={inputSmall + " flex-1"} value={newVehicleModel} onChange={e => setNewVehicleModel(e.target.value)} />
                              <input type="text" placeholder="Patente" className={inputSmall + " flex-1"} value={newVehiclePatente} onChange={e => setNewVehiclePatente(e.target.value)} />
                              <button onClick={addVehicle} className="bg-primary-600 text-white px-2 rounded text-xs">+</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <button onClick={() => { if (selectedClient) setShowVehiclePicker(true); }} className="bg-primary-600 hover:bg-primary-700 text-white p-1.5 rounded-lg transition-colors"><Plus className="w-4 h-4" /></button>
                  </div>
                  {selectedVehicle && (
                    <div className="ml-26 text-xs text-gray-400">
                      <span>Dominio: {selectedVehicle.patente}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-400 w-24">Concepto</label>
                  <select value={concepto} onChange={e => setConcepto(e.target.value)} className={inputClass}>
                    {conceptos.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-400">Kilometraje</label>
                  <input type="number" className={inputSmall + " w-20"} value={kilometraje} onChange={e => setKilometraje(e.target.value)} />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-400">N° Inspector</label>
                  <input type="text" className={inputSmall} value={numInspector} onChange={e => setNumInspector(e.target.value)} />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-400">N° Siniestro</label>
                  <input type="text" className={inputSmall} value={numSiniestro} onChange={e => setNumSiniestro(e.target.value)} />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-400">Franquicia</label>
                  <input type="number" className={inputSmall + " w-20"} value={franquicia} onChange={e => setFranquicia(e.target.value)} />
                </div>
              </div>

              <div className="border border-gray-700 rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[#0f1219] border-b border-gray-700">
                      <th className="text-left px-3 py-2 text-gray-400 font-medium">Ítem</th>
                      <th className="text-right px-3 py-2 text-gray-400 font-medium">Importe</th>
                      <th className="text-center px-3 py-2 text-gray-400 font-medium">Cantidad</th>
                      <th className="text-center px-3 py-2 text-gray-400 font-medium">Tipo</th>
                      <th className="text-center px-3 py-2 text-gray-400 font-medium">Desc.%</th>
                      <th className="text-right px-3 py-2 text-gray-400 font-medium">Subtotal</th>
                      <th className="text-right px-3 py-2 text-gray-400 font-medium">IVA</th>
                      <th className="text-left px-3 py-2 text-gray-400 font-medium">Cód. Producto</th>
                      <th className="w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {items.map((it, i) => {
                      const sub = it.amount * it.quantity * (1 - (it.discount || 0) / 100);
                      const iva = sub * 0.21;
                      return (
                        <tr key={i} className="hover:bg-[#222839]">
                          <td className="px-2 py-1"><input type="text" placeholder="Buscar Producto o Servicio..." className={inputSmall + " w-full"} value={it.description} onChange={e => updateItem(i, 'description', e.target.value)} /></td>
                          <td className="px-2 py-1"><input type="number" className={inputSmall + " w-full text-right"} value={it.amount || ''} onChange={e => updateItem(i, 'amount', Number(e.target.value))} /></td>
                          <td className="px-2 py-1"><input type="number" className={inputSmall + " w-full text-center"} value={it.quantity} onChange={e => updateItem(i, 'quantity', Number(e.target.value))} min="1" /></td>
                          <td className="px-2 py-1">
                            <select className={inputSmall + " w-full"} value={it.type} onChange={e => updateItem(i, 'type', e.target.value)}>
                              {itemTipos.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </td>
                          <td className="px-2 py-1"><input type="number" className={inputSmall + " w-full text-center"} value={it.discount || ''} onChange={e => updateItem(i, 'discount', Number(e.target.value))} /></td>
                          <td className="px-2 py-1 text-right text-gray-300">${sub.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                          <td className="px-2 py-1 text-right text-gray-400">${iva.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                          <td className="px-2 py-1"><input type="text" className={inputSmall + " w-full"} value={it.sku} onChange={e => updateItem(i, 'sku', e.target.value)} /></td>
                          <td className="px-1">
                            {items.length > 1 && (
                              <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-300 p-1"><Trash2 className="w-3 h-3" /></button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="p-2 border-t border-gray-700">
                  <button onClick={addItem} className="text-primary-400 hover:text-primary-300 text-xs flex items-center gap-1"><Plus className="w-3 h-3" /> Agregar ítem</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Observaciones</label>
                  <textarea className={inputClass + " resize-none"} rows={2} value={observaciones} onChange={e => setObservaciones(e.target.value)} placeholder="Observaciones..." />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Comentario Interno</label>
                  <textarea className={inputClass + " resize-none"} rows={2} value={comentarioInterno} onChange={e => setComentarioInterno(e.target.value)} placeholder="Comentario interno..." />
                </div>
              </div>

              <div className="bg-[#0f1219] border border-gray-700 rounded-lg p-4">
                <h3 className="text-xs font-semibold text-gray-400 mb-3">Resumen</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Descuento</span><span className="text-white">${Number(descuento).toLocaleString()}</span></div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Repuestos</span>
                    <span className="text-white ml-auto">${items.filter(it => it.type === 'Repuesto').reduce((s, it) => s + it.amount * it.quantity * (1 - (it.discount || 0) / 100), 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between"><span className="text-gray-400">Mano de Obra</span><span className="text-white">${items.filter(it => it.type === 'Servicio').reduce((s, it) => s + it.amount * it.quantity * (1 - (it.discount || 0) / 100), 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span></div>
                  <div></div>
                  <div className="flex justify-between"><span className="text-gray-400">Total neto</span><span className="text-white">${totalNeto.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">IVA 21%</span><span className="text-white">${totalIVA.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span></div>
                  <div className="col-span-2 flex justify-between border-t border-gray-700 pt-2 mt-1">
                    <span className="text-white font-bold">Total</span><span className="text-white font-bold text-lg">${totalGeneral.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 py-2.5 rounded-lg text-sm font-medium transition-colors">Cancelar</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">{saving ? 'Guardando...' : 'Guardar Presupuesto'}</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showClientModal && createPortal(
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4" onClick={() => setShowClientModal(false)}>
          <div className="bg-[#1a1f2e] border border-gray-700 rounded-2xl w-full max-w-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-lg font-bold text-white">AGREGAR</h2>
              <button onClick={() => setShowClientModal(false)} className="text-gray-400 hover:text-white p-1"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Nombre *</label>
                  <input type="text" className={inputClass} value={clientForm.name} onChange={e => setClientForm({ ...clientForm, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Nombre fantasia</label>
                  <input type="text" className={inputClass} value={clientForm.fantasy_name} onChange={e => setClientForm({ ...clientForm, fantasy_name: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Documento DNI</label>
                  <input type="text" className={inputClass} value={clientForm.dni} onChange={e => setClientForm({ ...clientForm, dni: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Tipo documento</label>
                  <select className={inputClass} value={clientForm.doc_type} onChange={e => setClientForm({ ...clientForm, doc_type: e.target.value })}>
                    <option>DNI</option><option>CUIL</option><option>CUIT</option><option>Pasaporte</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Tipo responsable</label>
                  <select className={inputClass} value={clientForm.tipo_responsable} onChange={e => setClientForm({ ...clientForm, tipo_responsable: e.target.value })}>
                    <option>Consumidor Final</option><option>Responsable Inscripto</option><option>Monotributista</option><option>Exento</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Domicilio fiscal</label>
                <input type="text" className={inputClass} value={clientForm.domicilio} onChange={e => setClientForm({ ...clientForm, domicilio: e.target.value })} />
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Contacto</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Telefono</label>
                    <input type="text" className={inputClass} value={clientForm.phone} onChange={e => setClientForm({ ...clientForm, phone: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Telefono alternativo</label>
                    <input type="text" className={inputClass} value={clientForm.phone_alt} onChange={e => setClientForm({ ...clientForm, phone_alt: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Email</label>
                    <input type="email" className={inputClass} value={clientForm.email} onChange={e => setClientForm({ ...clientForm, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Email alternativo</label>
                    <input type="email" className={inputClass} value={clientForm.email_alt} onChange={e => setClientForm({ ...clientForm, email_alt: e.target.value })} />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-xs text-gray-400 mb-1">Persona contacto</label>
                  <input type="text" className={inputClass} value={clientForm.contact_person} onChange={e => setClientForm({ ...clientForm, contact_person: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Comentario</label>
                <textarea className={inputClass + " resize-none"} rows={2} value={clientForm.notes} onChange={e => setClientForm({ ...clientForm, notes: e.target.value })} />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowClientModal(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 py-2.5 rounded-lg text-sm font-medium transition-colors">VOLVER</button>
                <button onClick={addClient} disabled={!clientForm.name.trim()} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">AGREGAR</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
