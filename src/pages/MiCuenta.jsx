import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Calendar, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MiCuenta() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Mi Cuenta</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-xl">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <h2 className="text-xl font-bold text-gray-800 mt-4">{user?.name || 'Usuario'}</h2>
          <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold mt-3">
            <Shield className="w-3.5 h-3.5" /> {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
          </span>
          <button
            onClick={handleLogout}
            className="mt-6 w-full btn-danger flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre</label>
                <input type="text" className="input-field" defaultValue={user?.name || ''} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input type="email" className="input-field" defaultValue={user?.email || ''} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Teléfono</label>
                <input type="tel" className="input-field" placeholder="+54 11 0000-0000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Rol</label>
                <input type="text" className="input-field bg-gray-50" value={user?.role === 'admin' ? 'Administrador' : 'Usuario'} disabled />
              </div>
            </div>
            <button className="btn-primary mt-4">Guardar Cambios</button>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Seguridad</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña Actual</label>
                <input type="password" className="input-field" placeholder="••••••••" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nueva Contraseña</label>
                  <input type="password" className="input-field" placeholder="Mínimo 8 caracteres" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar Nueva Contraseña</label>
                  <input type="password" className="input-field" placeholder="Repite la contraseña" />
                </div>
              </div>
              <button className="btn-secondary">Actualizar Contraseña</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
