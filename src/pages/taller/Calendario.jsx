import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const typeColors = {
  servicio: 'border-l-blue-500 bg-blue-50',
  turno: 'border-l-purple-500 bg-purple-50',
  entrega: 'border-l-emerald-500 bg-emerald-50',
};

export default function Calendario() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id);

      if (!error) setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDay = (date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDay(currentDate);
  const monthName = currentDate.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const getEventsForDay = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.event_date === dateStr);
  };

  const today = new Date();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Calendario</h1>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Evento
        </button>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-bold text-gray-800 capitalize">{monthName}</h2>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-6 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {days.map(d => (
            <div key={d} className="bg-primary-50 py-2 text-center text-xs font-bold text-primary-700 uppercase">
              {d}
            </div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-gray-50 min-h-[100px]" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayEvents = getEventsForDay(day);
            const isToday = day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
            return (
              <div key={day} className={`bg-white min-h-[100px] p-1.5 hover:bg-gray-50 transition-colors ${isToday ? 'ring-2 ring-primary-500 ring-inset' : ''}`}>
                <span className={`text-xs font-semibold ${isToday ? 'bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-gray-600'}`}>
                  {day}
                </span>
                <div className="mt-1 space-y-0.5">
                  {dayEvents.slice(0, 2).map(evt => (
                    <div key={evt.id} className={`text-[10px] border-l-2 ${typeColors[evt.type] || typeColors.servicio} px-1 py-0.5 rounded-r truncate`}>
                      {evt.event_time} {evt.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <p className="text-[10px] text-gray-400 pl-1">+{dayEvents.length - 2} más</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {events.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-bold text-gray-700 mb-3">Próximos eventos</h3>
          <div className="space-y-2">
            {events.slice(0, 5).map(evt => (
              <div key={evt.id} className={`flex items-center gap-3 p-3 rounded-lg border-l-4 ${typeColors[evt.type] || typeColors.servicio}`}>
                <div>
                  <p className="text-sm font-medium text-gray-800">{evt.title}</p>
                  <p className="text-xs text-gray-500">{evt.event_time} - {evt.event_date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
