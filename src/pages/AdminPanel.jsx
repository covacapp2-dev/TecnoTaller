import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
  Users, Bell, Trash2, Crown, Send, Shield, UserX, Gift,
  Calendar, Mail, Search, AlertTriangle, CheckCircle, X
} from 'lucide-react';

export default function AdminPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('usuarios');
  const [usuarios, setUsuarios] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [notiTitle, setNotiTitle] = useState('');
  const [notiMessage, setNotiMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsuarios();
      fetchNotifications();
    }
  }, [user]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsuarios = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    setUsuarios(data || []);
    setLoading(false);
  };

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
    setNotifications(data || []);
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('¿Eliminar este usuario y todos sus datos?')) return;
    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    if (!error) {
      setUsuarios(usuarios.filter(u => u.id !== userId));
      showToast('Usuario eliminado');
    }
  };

  const handleTogglePro = async (userId, currentPlan) => {
    const newPlan = currentPlan === 'pro' ? 'free' : 'pro';
    const updates = { subscription_plan: newPlan };
    if (newPlan === 'pro') {
      updates.subscription_active = true;
      updates.trial_ends_at = null;
    }
    const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
    if (!error) {
      setUsuarios(usuarios.map(u =>
        u.id === userId ? { ...u, ...updates } : u
      ));
      showToast(newPlan === 'pro' ? 'Acceso Pro activado' : 'Acceso cambiado a Free');
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!notiTitle.trim() || !notiMessage.trim()) return;
    setSending(true);
    const { error } = await supabase.from('notifications').insert({
      title: notiTitle.trim(),
      message: notiMessage.trim(),
      created_by: user.id,
    });
    setSending(false);
    if (!error) {
      setNotiTitle('');
      setNotiMessage('');
      fetchNotifications();
      showToast('Notificación enviada a todos los usuarios');
    }
  };

  const handleDeleteNotification = async (id) => {
    await supabase.from('notifications').delete().eq('id', id);
    setNotifications(notifications.filter(n => n.id !== id));
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700">Acceso Denegado</h2>
          <p className="text-gray-500 mt-2">Solo los administradores pueden acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  const filteredUsuarios = usuarios.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white text-sm ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Shield className="w-7 h-7 text-primary-600" />
            Panel de Administración
          </h1>
          <p className="text-gray-500 text-sm mt-1">Gestiona usuarios y notificaciones</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('usuarios')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'usuarios'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users className="w-4 h-4" />
          Usuarios ({usuarios.length})
        </button>
        <button
          onClick={() => setActiveTab('notificaciones')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'notificaciones'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Bell className="w-4 h-4" />
          Notificaciones
        </button>
      </div>

      {activeTab === 'usuarios' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
              <p className="mt-3 text-gray-500 text-sm">Cargando usuarios...</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Usuario</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Rol</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Plan</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Registro</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsuarios.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold text-sm">
                              {u.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{u.name}</p>
                              <p className="text-xs text-gray-500">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-700'
                              : u.role === 'worker'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {u.role === 'admin' && <Shield className="w-3 h-3" />}
                            {u.role === 'admin' ? 'Admin' : u.role === 'worker' ? 'Worker' : 'Usuario'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            u.subscription_plan === 'pro'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {u.subscription_plan === 'pro' ? 'Pro ✓' : 'Free'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {new Date(u.created_at).toLocaleDateString('es-AR')}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleTogglePro(u.id, u.subscription_plan)}
                              className={`p-1.5 rounded-lg text-xs transition-colors ${
                                u.subscription_plan === 'pro'
                                  ? 'text-yellow-600 hover:bg-yellow-50'
                                  : 'text-green-600 hover:bg-green-50'
                              }`}
                              title={u.subscription_plan === 'pro' ? 'Quitar Pro' : 'Dar Pro gratis'}
                            >
                              <Gift className="w-4 h-4" />
                            </button>
                            {u.role !== 'admin' && (
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                title="Eliminar usuario"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredUsuarios.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No se encontraron usuarios</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'notificaciones' && (
        <div className="space-y-6">
          <form onSubmit={handleSendNotification} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Send className="w-5 h-5 text-primary-600" />
              Enviar notificación a todos los usuarios
            </h3>
            <input
              type="text"
              placeholder="Título de la notificación"
              value={notiTitle}
              onChange={(e) => setNotiTitle(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
            <textarea
              placeholder="Escribí el mensaje de la notificación..."
              value={notiMessage}
              onChange={(e) => setNotiMessage(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              required
            />
            <button
              type="submit"
              disabled={sending || !notiTitle.trim() || !notiMessage.trim()}
              className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
              {sending ? 'Enviando...' : 'Enviar notificación'}
            </button>
          </form>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800 text-sm">Notificaciones enviadas</h3>
            </div>
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Bell className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No hay notificaciones enviadas</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((n) => (
                  <div key={n.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-sm">{n.title}</p>
                        <p className="text-gray-600 text-sm mt-1">{n.message}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(n.created_at).toLocaleString('es-AR')}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteNotification(n.id)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
