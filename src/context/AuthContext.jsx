import { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../data/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const session = await AuthService.getSession();
      if (session) setUser(session);
      setLoading(false);
    };
    checkSession();
  }, []);

  const login = async (email, password) => {
    const result = await AuthService.login(email, password);
    if (result.success) setUser(result.user);
    return result;
  };

  const register = async (name, email, password) => {
    const result = await AuthService.register(name, email, password);
    if (result.success) setUser(result.user);
    return result;
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
