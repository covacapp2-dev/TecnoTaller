import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home, Wrench, Calendar, Bell, Car, History, ShoppingBag, DollarSign,
  Users, Package, UserCheck, Phone, BarChart3, FileText, Settings,
  LogOut, Menu, X, ChevronDown, ChevronRight, CreditCard, ClipboardList,
  BookOpen, TrendingUp, AlertCircle, Hammer, Sliders
} from 'lucide-react';

const menuItems = [
  { path: '/inicio', label: 'Inicio', icon: Home },
  {
    label: 'Taller', icon: Wrench, children: [
      { path: '/taller/ordenes', label: 'Órdenes', icon: ClipboardList },
      { path: '/taller/presupuesto', label: 'Presupuesto', icon: BookOpen },
      { path: '/taller/calendario', label: 'Calendario', icon: Calendar },
      { path: '/taller/recordatorios', label: 'Recordatorios', icon: Bell },
      { path: '/taller/vehiculos', label: 'Vehículos', icon: Car },
      { path: '/taller/historico', label: 'Histórico', icon: History },
    ]
  },
  { path: '/tienda', label: 'Tienda', icon: ShoppingBag },
  { path: '/caja', label: 'Caja', icon: DollarSign },
  { path: '/cuenta-corrientes', label: 'Cuenta Corrientes', icon: CreditCard },
  { path: '/inventario', label: 'Inventario', icon: Package },
  { path: '/trabajadores', label: 'Trabajadores', icon: UserCheck },
  { path: '/contactos', label: 'Contactos', icon: Phone },
  { path: '/grafica', label: 'Gráfica', icon: BarChart3 },
  { path: '/informes', label: 'Informes', icon: FileText },
  { path: '/herramientas', label: 'Herramientas', icon: Hammer },
  { path: '/configuracion', label: 'Configuración', icon: Sliders },
  { path: '/mi-cuenta', label: 'Mi Cuenta', icon: Users },
];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState('Taller');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleSubmenu = (label) => {
    setExpandedMenu(expandedMenu === label ? null : label);
  };

  const isActive = (path) => location.pathname === path;
  const isParentActive = (item) => {
    if (item.path) return isActive(item.path);
    if (item.children) return item.children.some(c => isActive(c.path));
    return false;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {collapsed && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onToggle} />
      )}

      <aside className={`fixed top-0 left-0 h-full bg-gradient-to-b from-primary-900 to-primary-950 text-white z-50 
        transition-all duration-300 ease-in-out overflow-y-auto
        ${collapsed ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-[72px]'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-primary-700/50">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="TecnoTaller" className="w-10 h-10 rounded-xl flex-shrink-0 shadow-lg object-cover" />
            {collapsed && (
              <div className="animate-fade-in">
                <h1 className="text-lg font-bold leading-tight">
                  <span className="text-blue-400">Tecno</span><span className="text-white">Taller</span>
                </h1>
                <p className="text-[10px] text-primary-300 uppercase tracking-widest">Soluciones Automotrices</p>
              </div>
            )}
          </div>
          <button onClick={onToggle} className="text-primary-300 hover:text-white p-1 rounded-lg hover:bg-primary-700/50 transition-colors">
            {collapsed ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="p-3 space-y-0.5 pb-20">
          {menuItems.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className={`sidebar-link w-full ${isParentActive(item) ? 'bg-primary-700/50 text-white' : 'text-primary-200 hover:bg-primary-700/30 hover:text-white'}`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {expandedMenu === item.label ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </>
                    )}
                  </button>
                  {collapsed && expandedMenu === item.label && (
                    <div className="ml-4 mt-0.5 space-y-0.5 border-l border-primary-700 pl-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`sidebar-link text-xs ${isActive(child.path) ? 'bg-primary-500 text-white' : 'text-primary-300 hover:bg-primary-700/30 hover:text-white'}`}
                        >
                          <child.icon className="w-4 h-4 flex-shrink-0" />
                          <span>{child.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  className={`sidebar-link ${isActive(item.path) ? 'bg-primary-500 text-white shadow-md' : 'text-primary-200 hover:bg-primary-700/30 hover:text-white'}`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {collapsed && <span>{item.label}</span>}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-primary-700/50 bg-primary-950/80 backdrop-blur">
          <button
            onClick={handleLogout}
            className="sidebar-link w-full text-red-300 hover:bg-red-500/20 hover:text-red-200"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {collapsed && <span>Salir</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
