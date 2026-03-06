import { supabase } from '../supabase'

export const userApi = {
  // 登录
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // 注册
  register: async (email: string, password: string, username?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username
        }
      }
    })
    return { data, error }
  },

  // 登出
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // 获取用户信息
  getProfile: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: new Error('User not authenticated') }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    return { data, error }
  },

  // 更新用户信息
  updateProfile: async (data: {
    username?: string
    avatar?: string
  }) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: new Error('User not authenticated') }

    const { data: profile, error } = await supabase
      .from('users')
      .update(data)
      .eq('id', user.id)
      .select()
      .single()
    return { data: profile, error }
  }
}
