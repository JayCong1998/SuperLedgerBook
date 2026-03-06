import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Plus, BarChart2, Settings, User, X, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const { user, signOut } = useAuth()
  
  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || '用户'
  const userInitial = username.charAt(0).toUpperCase()

  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/add', icon: Plus, label: '记账' },
    { path: '/statistics', icon: BarChart2, label: '统计' },
    { path: '/settings', icon: Settings, label: '设置' }
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      setUserMenuOpen(false)
    } catch (error) {
      console.error('登出失败:', error)
    }
  }

  return (
    <>
      {/* 顶部导航栏 */}
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">记账本</h1>
            
            {/* PC端导航 */}
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1 ${location.pathname === item.path ? 'font-bold' : 'hover:text-gray-200'}`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              
              {/* 用户菜单 */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 hover:text-gray-200"
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">{userInitial}</span>
                    </div>
                    <span>{username}</span>
                    <ChevronDown size={16} />
                  </button>
                  
                  {/* 用户下拉菜单 */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 text-gray-800">
                      <Link
                        to="/settings"
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings size={18} />
                        <span>设置</span>
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 w-full text-left"
                      >
                        <LogOut size={18} />
                        <span>退出登录</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center space-x-1 hover:text-gray-200"
                >
                  <User size={18} />
                  <span>登录</span>
                </Link>
              )}
            </nav>
            
            {/* 移动端菜单按钮 */}
            <div className="md:hidden">
              <button 
                className="p-2"
                onClick={() => setMobileMenuOpen(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* 移动端菜单 */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-primary">菜单</h2>
            <button 
              className="p-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
          
          {/* 用户信息 */}
          {user && (
            <div className="bg-primary/10 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
                  <span className="text-lg font-bold">{userInitial}</span>
                </div>
                <div>
                  <p className="font-bold text-gray-800">{username}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>
          )}
          
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${location.pathname === item.path ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-gray-100'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon size={20} />
                  <span className="text-lg">{item.label}</span>
                </Link>
              )
            })}
            
            {user ? (
              <>
                <hr className="my-2" />
                <button
                  onClick={async () => {
                    await handleSignOut()
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-red-600"
                >
                  <LogOut size={20} />
                  <span className="text-lg">退出登录</span>
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="flex items-center space-x-3 p-3 rounded-lg bg-primary text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={20} />
                <span className="text-lg">登录</span>
              </Link>
            )}
          </nav>
        </div>
      )}
      
      {/* 移动端底部导航 */}
      <div className="bottom-nav">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center ${location.pathname === item.path ? 'text-primary' : 'text-gray-600'}`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </>
  )
}

export default Header