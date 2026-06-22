import { useState, useEffect } from 'react';
import { Plus, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const priorityStyles = {
  alta: { bg: 'bg-red-50 border-red-200', dot: 'bg-red-500', text: 'text-red-700' },
  media: { bg: 'bg-amber-50 border-amber-200', dot: 'bg-amber-500', text: 'text-amber-700' },
  baja: { bg: 'bg-blue-50 border-blue-200', dot: 'bg-blue-500', text: 'text-blue-700' },
};

export default function Recordatorios() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true });

      if (!error) setItems(data || []);
    } catch (error) {
      console.error('Error loading reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDone = async (id, done) => {
    try {
      await supabase.from('reminders').update({ done: !done }).eq('id', id);
      setItems(items.map(i => i.id === id ? { ...i, done: !done } : i));
    } catch (error) {
      console.error('Error updating reminder:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Recordatorios</h1>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Recordatorio
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="card text-center py-12 text-gray-400">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No hay recordatorios ainda</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map(item => {
            const ps = priorityStyles[item.priority] || priorityStyles.media;
            return (
              <div key={item.id} className={`card flex items-center gap-4 border-l-4 ${ps.bg} ${item.done ? 'opacity-60' : ''}`}>
                <button
                  onClick={() => toggleDone(item.id, item.done)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    item.done ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 hover:border-primary-500'
                  }`}
                >
                  {item.done && <CheckCircle className="w-4 h-4 text-white" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${item.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {item.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(item.due_date).toLocaleDateString('es-AR')}
                    </span>
                    <span className={`text-xs font-semibold ${ps.text}`}>
                      {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
