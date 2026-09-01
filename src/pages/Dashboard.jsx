import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home, ClipboardList, BookOpen, Calendar, Bell, Car, History,
  ShoppingBag, DollarSign, CreditCard, Package, UserCheck, Phone,
  BarChart3, FileText, Hammer, Settings, Users, Shield
} from 'lucide-react';

const menuCards = [
  { label: 'Órdenes', path: '/taller/ordenes', icon: ClipboardList, emoji: '🔧' },
  { label: 'Presupuesto', path: '/taller/presupuesto', icon: BookOpen, emoji: '📋' },
  { label: 'Calendario', path: '/taller/calendario', icon: Calendar, emoji: '📅' },
  { label: 'Recordatorios', path: '/taller/recordatorios', icon: Bell, emoji: '🔔' },
  { label: 'Vehículos', path: '/taller/vehiculos', icon: Car, emoji: '🚗' },
  { label: 'Histórico', path: '/taller/historico', icon: History, emoji: '📁' },
  { label: 'Tienda', path: '/tienda', icon: ShoppingBag, emoji: '🛒' },
  { label: 'Caja', path: '/caja', icon: DollarSign, emoji: '💰' },
  { label: 'Cuenta Corrientes', path: '/cuenta-corrientes', icon: CreditCard, emoji: '💳' },
  { label: 'Inventario', path: '/inventario', icon: Package, emoji: '📦' },
  { label: 'Trabajadores', path: '/trabajadores', icon: UserCheck, emoji: '👷' },
  { label: 'Contactos', path: '/contactos', icon: Phone, emoji: '📞' },
  { label: 'Gráfica', path: '/grafica', icon: BarChart3, emoji: '📊' },
  { label: 'Informes', path: '/informes', icon: FileText, emoji: '📝' },
  { label: 'Herramientas', path: '/herramientas', icon: Hammer, emoji: '🛠️' },
  { label: 'Configuración', path: '/configuracion', icon: Settings, emoji: '⚙️' },
  { label: 'Mi Cuenta', path: '/mi-cuenta', icon: Users, emoji: '👤' },
];

const adminCard = { label: 'Admin', path: '/admin', icon: Shield, emoji: '🛡️' };

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const allCards = user?.role === 'admin' ? [...menuCards, adminCard] : menuCards;

  return (
    <div className="min-h-full -m-6 p-4 bg-[#0f1219]">
      <div className="flex flex-col items-center mb-4 pt-2">
        <img src="/logo.svg" alt="TecnoTaller" className="w-14 h-14 mb-2 drop-shadow-lg" />
        <h1 className="text-xl font-bold">
          <span className="text-blue-400">Tecno</span><span className="text-white">Taller</span>
        </h1>
        <p className="text-gray-400 text-[10px] uppercase tracking-widest mt-0.5">Soluciones Automotrices</p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {allCards.map((card) => (
          <button
            key={card.path}
            onClick={() => navigate(card.path)}
            className="group relative bg-[#1a1f2e] hover:bg-[#222839] border border-gray-700/50 hover:border-primary-500/50 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary-500/10 cursor-pointer"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
              {card.emoji}
            </span>
            <span className="text-gray-300 group-hover:text-white text-[11px] font-medium text-center leading-tight">
              {card.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
