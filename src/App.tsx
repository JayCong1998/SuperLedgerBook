import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AddTransaction from './pages/AddTransaction'
import Statistics from './pages/Statistics'
import Settings from './pages/Settings'
import Auth from './pages/Auth'
import Header from './components/Header'
import Footer from './components/Footer'
import { AuthProvider } from './contexts/AuthContext'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 pb-20 md:pb-0">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/add" element={<AddTransaction />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/auth" element={<Auth />} />
              </Routes>
            </main>
            <Footer className="hidden md:block" />
          </div>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  )
}

export default App