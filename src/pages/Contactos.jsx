import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, Plus, Phone, Mail, User, X, MapPin, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Contactos() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '', phone: '', email: '', address: '', notes: ''
  });

  const inputClass = "bg-[#1a1f2e] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-full";

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (!error) setContacts(data || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newContact.name.trim()) return;
    const { data, error } = await supabase.from('clients').insert({
      user_id: user.id,
      name: newContact.name,
      phone: newContact.phone,
      email: newContact.email,
      address: newContact.address,
      notes: newContact.notes,
    }).select().single();

    if (data) {
      setContacts([...contacts, data]);
      setShowModal(false);
      setNewContact({ name: '', phone: '', email: '', address: '', notes: '' });
    }
  };

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || '').includes(search) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full bg-[#0f1219] p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white">Clientes</h1>
          <p className="text-gray-500 text-xs mt-1">{filtered.length} clientes</p>
        </div>
        <button onClick={() => { setShowModal(true); setNewContact({ name: '', phone: '', email: '', address: '', notes: '' }); }} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Nuevo Cliente
        </button>
      </div>

      <div className="bg-[#1a1f2e] border border-gray-700 rounded-xl p-4 flex-1 flex flex-col min-h-0">
        <div className="relative mb-4 flex-shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="Buscar por nombre, teléfono o email..." className={inputClass + " pl-10"} value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <User className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">{contacts.length === 0 ? 'No hay clientes aún' : 'Sin resultados'}</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-2">
              {filtered.map(c => (
                <div key={c.id} className="bg-[#0f1219] border border-gray-700 rounded-lg p-3 hover:border-gray-600 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{c.name}</p>
                      <div className="flex items-center gap-4 mt-1">
                        {c.phone && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Phone className="w-3 h-3" /> {c.phone}
                          </span>
                        )}
                        {c.email && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Mail className="w-3 h-3" /> {c.email}
                          </span>
                        )}
                      </div>
                      {c.address && (
                        <span className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <MapPin className="w-3 h-3" /> {c.address}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showModal && createPortal(
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[#1a1f2e] border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-lg font-bold text-white">Nuevo Cliente</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white p-1"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-400">Nombre *</label>
                <input type="text" placeholder="Nombre del cliente..." className={inputClass} value={newContact.name} onChange={e => setNewContact({ ...newContact, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400">Teléfono</label>
                <input type="tel" placeholder="Número..." className={inputClass} value={newContact.phone} onChange={e => setNewContact({ ...newContact, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400">Email</label>
                <input type="email" placeholder="email@..." className={inputClass} value={newContact.email} onChange={e => setNewContact({ ...newContact, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400">Dirección</label>
                <input type="text" placeholder="Dirección..." className={inputClass} value={newContact.address} onChange={e => setNewContact({ ...newContact, address: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400">Notas</label>
                <textarea className={inputClass + " resize-none"} rows={2} placeholder="Opcional..." value={newContact.notes} onChange={e => setNewContact({ ...newContact, notes: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 py-2.5 rounded-lg text-sm font-medium transition-colors">Cancelar</button>
                <button onClick={handleCreate} disabled={!newContact.name.trim()} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">Crear Cliente</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}