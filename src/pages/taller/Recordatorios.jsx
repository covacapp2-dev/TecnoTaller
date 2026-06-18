import { useState } from 'react';
import { Bell, Plus, Clock, CheckCircle, AlertTriangle, Trash2 } from 'lucide-react';

const reminders = [
  { id: 1, title: 'Llamar a Juan Pérez para confirmar turno', date: '18/06/2024', time: '09:00', priority: 'alta', done: false },
  { id: 2, title: 'Pedir repuestos para Ford Fiesta', date: '18/06/2024', time: '12:00', priority: 'media', done: false },
  { id: 3, title: 'Revisar inventario de aceites', date: '19/06/2024', time: '08:00', priority: 'baja', done: true },
  { id: 4, title: 'Enviar presupuesto a María García', date: '19/06/2024', time: '10:00', priority: 'alta', done: false },
  { id: 5, title: 'Mantenimiento compresor', date: '20/06/2024', time: '15:00', priority: 'media', done: false },
];

const priorityStyles = {
  alta: { bg: 'bg-red-50 border-red-200', dot: 'bg-red-500', text: 'text-red-700' },
  media: { bg: 'bg-amber-50 border-amber-200', dot: 'bg-amber-500', text: 'text-amber-700' },
  baja: { bg: 'bg-blue-50 border-blue-200', dot: 'bg-blue-500', text: 'text-blue-700' },
};

export default function Recordatorios() {
  const [items, setItems] = useState(reminders);

  const toggleDone = (id) => {
    setItems(items.map(i => i.id === id ? { ...i, done: !i.done } : i));
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

      <div className="grid gap-3">
        {items.map(item => {
          const ps = priorityStyles[item.priority];
          return (
            <div key={item.id} className={`card flex items-center gap-4 border-l-4 ${ps.bg} ${item.done ? 'opacity-60' : ''}`}>
              <button
                onClick={() => toggleDone(item.id)}
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
                    <Clock className="w-3 h-3" /> {item.date} - {item.time}
                  </span>
                  <span className={`text-xs font-semibold ${ps.text}`}>
                    {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                  </span>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
