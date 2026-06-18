import { useAuth } from '../context/AuthContext';
import { Bell, Search, Menu, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Header({ onMenuToggle }) {
  const { user } = useAuth();
  const location = useLocation();

  const getBreadcrumb = () => {
    const parts = location.pathname.split('/').filter(Boolean);
    return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, ' '));
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <button onClick={onMenuToggle} className="lg:hidden text-gray-500 hover:text-primary-600 p-1">
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500">
            {getBreadcrumb().map((part, i, arr) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="w-3.5 h-3.5" />}
                <span className={i === arr.length - 1 ? 'text-primary-600 font-medium' : ''}>{part}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-64 transition-all"
            />
          </div>

          <button className="relative p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-700">{user?.name || 'Usuario'}</p>
              <p className="text-xs text-gray-400">{user?.role === 'admin' ? 'Administrador' : 'Usuario'}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
