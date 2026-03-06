import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, LogOut, Download, Upload, Moon, Bell, ChevronRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Settings = () => {
  const { user, signOut } = useAuth()
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
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">设置</h2>
      
      {/* 用户信息卡片 */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white">
            <span className="text-2xl font-bold">{userInitial}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800">{username}</h3>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>
        </div>
        
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 py-3 rounded-xl hover:bg-red-100 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">{loading ? '退出中...' : '退出登录'}</span>
        </button>
      </div>

      {/* 设置选项 */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">账户设置</h3>
        </div>
        
        <div className="divide-y divide-gray-100">
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User size={20} className="text-blue-600" />
              </div>
              <span className="text-gray-800">个人信息</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Moon size={20} className="text-purple-600" />
              </div>
              <span className="text-gray-800">深色模式</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">关闭</span>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          </button>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Bell size={20} className="text-yellow-600" />
              </div>
              <span className="text-gray-800">记账提醒</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">关闭</span>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          </button>
        </div>
      </div>

      {/* 数据管理 */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">数据管理</h3>
        </div>
        
        <div className="divide-y divide-gray-100">
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Download size={20} className="text-green-600" />
              </div>
              <span className="text-gray-800">导出数据</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Upload size={20} className="text-orange-600" />
              </div>
              <span className="text-gray-800">导入数据</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>
      </div>
      
      {/* 版本信息 */}
      <div className="mt-8 text-center text-gray-400 text-sm">
        <p>记账本 v1.0.0</p>
        <p className="mt-1">© 2026 Super Ledger Book</p>
      </div>
    </div>
  )
}

export default Settings