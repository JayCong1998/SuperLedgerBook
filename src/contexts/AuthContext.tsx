import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { userApi } from '../services/api/users'
import { supabase } from '../services/supabase'
import { User as SupabaseUser } from '@supabase/supabase-js'

interface AuthContextType {
  user: SupabaseUser | null
  loading: boolean
  error: string | null
  signUp: (email: string, password: string, username: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 初始化时获取用户信息
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      setLoading(false)
    })

    // 清理订阅
    return () => subscription.unsubscribe()
  }, [])

  // 注册
  const signUp = async (email: string, password: string, username: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await userApi.register(email, password, username)

      if (error) {
        throw error
      }
    } catch (error: any) {
      setError(error.message || '注册失败，请重试')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // 登录
  const signIn = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await userApi.login(email, password)

      if (error) {
        throw error
      }
    } catch (error: any) {
      setError(error.message || '登录失败，请重试')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // 登出
  const signOut = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await userApi.signOut()

      if (error) {
        throw error
      }
    } catch (error: any) {
      setError(error.message || '登出失败，请重试')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
