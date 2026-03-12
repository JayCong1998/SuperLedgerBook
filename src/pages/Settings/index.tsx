import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, LogOut, Download, Upload, Moon, Sun, Bell, ChevronRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'

const Settings = () => {
  const { user, signOut } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  
  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || '用户'
  const userInitial = username.charAt(0).toUpperCase()

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await signOut()
      navigate('/auth')
    } catch (error) {
      console.error('登出失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 dark:bg-dark-bg dark:text-dark-text">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">设置</h2>
      
      {/* 用户信息卡片 */}
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-md p-6 mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white">
            <span className="text-2xl font-bold">{userInitial}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">{username}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{user?.email}</p>
          </div>
        </div>
        
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-3 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">{loading ? '退出中...' : '退出登录'}</span>
        </button>
      </div>

      {/* 设置选项 */}
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-md overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-800 dark:text-white">账户设置</h3>
        </div>
        
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <User size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-gray-800 dark:text-white">个人信息</span>
            </div>
            <ChevronRight size={20} className="text-gray-400 dark:text-gray-500" />
          </button>
          
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                {isDarkMode ? (
                  <Sun size={20} className="text-purple-600 dark:text-purple-400" />
                ) : (
                  <Moon size={20} className="text-purple-600 dark:text-purple-400" />
                )}
              </div>
              <span className="text-gray-800 dark:text-white">{isDarkMode ? '亮色模式' : '深色模式'}</span>
            </div>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
              <input 
                type="checkbox" 
                checked={isDarkMode} 
                onChange={toggleTheme}
                className="sr-only"
              />
              <span className={`block h-6 rounded-full ${isDarkMode ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
              <span className={`absolute left-1 top-1 block w-4 h-4 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}></span>
            </div>
          </button>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                <Bell size={20} className="text-yellow-600 dark:text-yellow-400" />
              </div>
              <span className="text-gray-800 dark:text-white">记账提醒</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">关闭</span>
              <ChevronRight size={20} className="text-gray-400 dark:text-gray-500" />
            </div>
          </button>
        </div>
      </div>

      {/* 数据管理 */}
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-800 dark:text-white">数据管理</h3>
        </div>
        
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Download size={20} className="text-green-600 dark:text-green-400" />
              </div>
              <span className="text-gray-800 dark:text-white">导出数据</span>
            </div>
            <ChevronRight size={20} className="text-gray-400 dark:text-gray-500" />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <Upload size={20} className="text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-gray-800 dark:text-white">导入数据</span>
            </div>
            <ChevronRight size={20} className="text-gray-400 dark:text-gray-500" />
          </button>
        </div>
      </div>
      
      {/* 版本信息 */}
      <div className="mt-8 text-center text-gray-400 dark:text-gray-500 text-sm">
        <p>记账本 v1.0.0</p>
        <p className="mt-1">© 2026 Super Ledger Book</p>
      </div>
    </div>
  )
}

export default Settings