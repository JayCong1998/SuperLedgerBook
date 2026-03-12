import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HomeOutlined, PlusOutlined, BarChartOutlined, SettingOutlined, UserOutlined, LogoutOutlined, MenuOutlined, CloseOutlined, DownOutlined } from '@ant-design/icons'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { Dropdown, Button } from 'antd'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { user, signOut } = useAuth()
  const { isDarkMode } = useTheme()
  
  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || '用户'
  const userInitial = username.charAt(0).toUpperCase()

  const navItems = [
    { path: '/', icon: HomeOutlined, label: '首页' },
    { path: '/add', icon: PlusOutlined, label: '记账' },
    { path: '/statistics', icon: BarChartOutlined, label: '统计' },
    { path: '/settings', icon: SettingOutlined, label: '设置' }
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
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
                    <Icon />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              
              {/* 用户菜单 */}
              {user ? (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 'settings',
                        icon: <SettingOutlined />,
                        label: (
                          <Link to="/settings">设置</Link>
                        ),
                      },
                      {
                        key: 'logout',
                        icon: <LogoutOutlined />,
                        label: '退出登录',
                        onClick: handleSignOut,
                      },
                    ],
                  }}
                  placement="bottomRight"
                >
                  <Button type="text" className="flex items-center space-x-2 text-white hover:text-gray-200">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">{userInitial}</span>
                    </div>
                    <span>{username}</span>
                    <DownOutlined />
                  </Button>
                </Dropdown>
              ) : (
                <Link to="/auth">
                  <Button type="text" className="flex items-center space-x-1 text-white hover:text-gray-200">
                    <UserOutlined />
                    <span>登录</span>
                  </Button>
                </Link>
              )}
            </nav>
            
            {/* 移动端菜单按钮 */}
            <div className="md:hidden">
              <Button 
                type="text" 
                icon={<MenuOutlined />} 
                className="text-white"
                onClick={() => setMobileMenuOpen(true)}
              />
            </div>
          </div>
        </div>
      </header>
      
      {/* 移动端菜单 */}
      {mobileMenuOpen && (
        <div className={`mobile-menu ${isDarkMode ? 'dark:bg-dark-bg dark:text-dark-text' : ''}`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-primary">菜单</h2>
            <Button 
              type="text" 
              icon={<CloseOutlined />} 
              className={isDarkMode ? 'text-white' : ''}
              onClick={() => setMobileMenuOpen(false)}
            />
          </div>
          
          {/* 用户信息 */}
          {user && (
            <div className="bg-primary/10 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
                  <span className="text-lg font-bold">{userInitial}</span>
                </div>
                <div>
                  <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{username}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{user.email}</p>
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
                  className={`flex items-center space-x-3 p-3 rounded-lg ${location.pathname === item.path ? 'bg-primary/10 text-primary font-bold' : isDarkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon />
                  <span className={`text-lg ${isDarkMode ? 'text-white' : ''}`}>{item.label}</span>
                </Link>
              )
            })}
            
            {user ? (
              <>
                <hr className={isDarkMode ? 'border-gray-700' : 'border-gray-200'} />
                <Button
                  type="text"
                  icon={<LogoutOutlined />}
                  className={`flex items-center justify-start space-x-3 p-3 rounded-lg ${isDarkMode ? 'hover:bg-gray-800/50 text-red-400' : 'hover:bg-gray-100 text-red-600'}`}
                  onClick={async () => {
                    await handleSignOut()
                    setMobileMenuOpen(false)
                  }}
                >
                  <span className={`text-lg ${isDarkMode ? 'text-white' : ''}`}>退出登录</span>
                </Button>
              </>
            ) : (
              <Link
                to="/auth"
                className="flex items-center space-x-3 p-3 rounded-lg bg-primary text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserOutlined />
                <span className="text-lg">登录</span>
              </Link>
            )}
          </nav>
        </div>
      )}
      
      {/* 移动端底部导航 */}
      <div className={`bottom-nav ${isDarkMode ? 'dark:bg-dark-card dark:text-white' : ''}`}>
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center ${location.pathname === item.path ? 'text-primary' : isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              <Icon />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </>
  )
}

export default Header