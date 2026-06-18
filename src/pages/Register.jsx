import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Wrench, CheckCircle } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const passwordValid = password.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Completa todos los campos');
      return;
    }
    if (!passwordValid) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (!passwordsMatch) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const result = register(name, email, password);
    setLoading(false);
    if (result.success) {
      navigate('/inicio');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
          <div className="text-center mb-8">
            <img src="/logo.svg" alt="TecnoTaller Logo" className="w-24 h-24 mx-auto mb-4 rounded-2xl shadow-lg object-cover" />
            <h1 className="text-2xl font-bold">
              <span className="text-blue-600">Tecno</span><span className="text-gray-800">Taller</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">1 mes gratis incluido</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre del Taller</label>
              <input
                type="text"
                className="input-field"
                placeholder="Mi Taller"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="taller@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-11"
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {password && (
                <div className="mt-1.5 text-xs flex items-center gap-1.5">
                  <CheckCircle className={`w-3.5 h-3.5 ${passwordValid ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className={passwordValid ? 'text-green-600' : 'text-gray-400'}>
                    Mínimo 8 caracteres
                  </span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar Contraseña</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className={`input-field pr-11 ${confirmPassword ? (passwordsMatch ? 'border-green-500 focus:ring-green-500' : 'border-red-500 focus:ring-red-500') : ''}`}
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword && (
                <div className="mt-1.5 text-xs flex items-center gap-1.5">
                  <CheckCircle className={`w-3.5 h-3.5 ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={passwordsMatch ? 'text-green-600' : 'text-red-500'}>
                    {passwordsMatch ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-base disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creando cuenta...
                </>
              ) : 'Crear Cuenta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-primary-200 text-xs mt-6">
          © 2024 TecnoTaller. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
