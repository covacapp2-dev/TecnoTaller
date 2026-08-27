import { supabase } from '../lib/supabase'

const DEFAULT_ADMIN = {
  email: 'grafica.covac@hotmail.com',
  password: 'a4618765',
  name: 'Administrador',
  role: 'admin',
};

export const AuthService = {
  login: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message === 'Invalid login credentials' ? 'Email o contraseña incorrectos' : error.message }
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      console.log('PROFILE QUERY:', profile, profileError)

      const user = {
        id: data.user.id,
        email: data.user.email,
        name: profile?.name || data.user.email.split('@')[0],
        role: profile?.role || 'user',
      }

      return { success: true, user }
    } catch (err) {
      return { success: false, error: 'Error al conectar con el servidor' }
    }
  },

  register: async (name, email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role: 'user' }
        }
      })

      if (error) {
        if (error.message.includes('already registered')) {
          return { success: false, error: 'Este email ya está registrado' }
        }
        return { success: false, error: error.message }
      }

      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          name,
          email,
          role: 'user',
          trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
      }

      const user = {
        id: data.user.id,
        email: data.user.email,
        name,
        role: 'user',
      }

      return { success: true, user }
    } catch (err) {
      return { success: false, error: 'Error al conectar con el servidor' }
    }
  },

  logout: async () => {
    await supabase.auth.signOut()
  },

  getSession: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) return null

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      return {
        id: session.user.id,
        email: session.user.email,
        name: profile?.name || session.user.email.split('@')[0],
        role: profile?.role || 'user',
      }
    } catch {
      return null
    }
  },

  updateUser: async (userId, updates) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)

      return !error
    } catch {
      return false
    }
  },

  createAdminUser: async () => {
    try {
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', DEFAULT_ADMIN.email)
        .single()

      if (existing) return { success: true, message: 'Admin ya existe' }

      const { data, error } = await supabase.auth.admin.createUser({
        email: DEFAULT_ADMIN.email,
        password: DEFAULT_ADMIN.password,
        email_confirm: true,
        user_metadata: { name: DEFAULT_ADMIN.name }
      })

      if (error) return { success: false, error: error.message }

      await supabase.from('profiles').insert({
        id: data.user.id,
        name: DEFAULT_ADMIN.name,
        email: DEFAULT_ADMIN.email,
        role: 'admin',
      })

      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  },
};
