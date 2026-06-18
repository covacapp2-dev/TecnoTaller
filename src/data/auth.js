const DEFAULT_ADMIN = {
  id: '1',
  name: 'Administrador',
  email: 'grafica.covac@hotmail.com',
  password: 'a4618765',
  role: 'admin',
  createdAt: new Date().toISOString(),
};

const getUsers = () => {
  const stored = localStorage.getItem('tt_users');
  if (stored) {
    const users = JSON.parse(stored);
    if (!users.find(u => u.email === DEFAULT_ADMIN.email)) {
      users.push(DEFAULT_ADMIN);
      localStorage.setItem('tt_users', JSON.stringify(users));
    }
    return users;
  }
  localStorage.setItem('tt_users', JSON.stringify([DEFAULT_ADMIN]));
  return [DEFAULT_ADMIN];
};

const saveUsers = (users) => {
  localStorage.setItem('tt_users', JSON.stringify(users));
};

export const AuthService = {
  login: (email, password) => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return { success: false, error: 'Email o contraseña incorrectos' };
    const { password: _, ...safeUser } = user;
    localStorage.setItem('tt_session', JSON.stringify(safeUser));
    return { success: true, user: safeUser };
  },

  register: (name, email, password) => {
    const users = getUsers();
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Este email ya está registrado' };
    }
    const newUser = {
      id: String(Date.now()),
      name,
      email,
      password,
      role: 'user',
      createdAt: new Date().toISOString(),
      subscription: {
        plan: 'free',
        trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        active: true,
      },
    };
    users.push(newUser);
    saveUsers(users);
    const { password: _, ...safeUser } = newUser;
    localStorage.setItem('tt_session', JSON.stringify(safeUser));
    return { success: true, user: safeUser };
  },

  logout: () => {
    localStorage.removeItem('tt_session');
  },

  getSession: () => {
    const session = localStorage.getItem('tt_session');
    return session ? JSON.parse(session) : null;
  },

  updateUser: (userId, updates) => {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return false;
    users[idx] = { ...users[idx], ...updates };
    saveUsers(users);
    const { password: _, ...safeUser } = users[idx];
    localStorage.setItem('tt_session', JSON.stringify(safeUser));
    return true;
  },
};
