import { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../data/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = AuthService.getSession();
    if (session) setUser(session);
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const result = AuthService.login(email, password);
    if (result.success) setUser(result.user);
    return result;
  };

  const register = (name, email, password) => {
    const result = AuthService.register(name, email, password);
    if (result.success) setUser(result.user);
    return result;
  };

  const logout = () => {
    AuthService.logout();
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
