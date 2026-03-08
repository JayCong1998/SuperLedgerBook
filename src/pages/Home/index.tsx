import { Link } from 'react-router-dom'
import { Plus, TrendingUp, TrendingDown, Wallet, Calendar, Car, ShoppingBag, Film, Heart, Book, Home as HomeIcon, MoreHorizontal, DollarSign, Gift, Coffee } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../services/supabase'
import { useState, useEffect } from 'react'
import { CATEGORIES } from '../../constants/categories'

const Home = () => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<any[]>([])
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpense, setTotalExpense] = useState(0)
  const [loading, setLoading] = useState(true)
  
  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || '用户'
  const userInitial = username.charAt(0).toUpperCase()
  const currentDate = new Date()
  const currentMonth = currentDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })

  // 图标映射函数
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'coffee': <Coffee size={20} />,
      'utensils': <Coffee size={20} />,
      'car': <Car size={20} />,
      'shopping-bag': <ShoppingBag size={20} />,
      'film': <Film size={20} />,
      'heart': <Heart size={20} />,
      'book': <Book size={20} />,
      'home': <HomeIcon size={20} />,
      'more-horizontal': <MoreHorizontal size={20} />,
      'dollar-sign': <DollarSign size={20} />,
      'gift': <Gift size={20} />,
      'trending-up': <TrendingUp size={20} />
    }
    return iconMap[iconName] || <MoreHorizontal size={20} />
  }

  // 加载交易记录和统计数据
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const loadData = async () => {
      try {
        // 计算当月的开始和结束日期
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]

        console.log('查询参数:', {
          user_id: user.id,
          startOfMonth,
          endOfMonth
        })

        // 获取交易记录
        const { data: transactionData, error: transactionError } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', startOfMonth)
          .lte('date', endOfMonth)
          .order('date', { ascending: false })

        console.log('查询结果:', {
          data: transactionData,
          error: transactionError
        })

        if (transactionError) {
          throw transactionError
        }

        // 为交易数据添加分类信息
        const transactionsWithCategory = (transactionData || []).map((transaction: any) => {
          const category = CATEGORIES.find((c: any) => c.id === transaction.category_id)
          return {
            ...transaction,
            categories: category || { name: '未知分类', icon: 'more-horizontal' }
          }
        })

        setTransactions(transactionsWithCategory)

        // 计算收支总额
        let income = 0
        let expense = 0

        transactionData?.forEach((transaction: any) => {
          if (transaction.type === 'income') {
            income += transaction.amount
          } else {
            expense += transaction.amount
          }
        })

        setTotalIncome(income)
        setTotalExpense(expense)
      } catch (error) {
        console.error('加载数据失败:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user])

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 用户欢迎区域 */}
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 mb-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">你好，{username} 👋</h2>
            <p className="text-blue-100 text-sm">{currentMonth} 财务概览</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold">{userInitial}</span>
          </div>
        </div>
        
        {/* 快速记账入口 */}
        <Link
          to="/add"
          className="flex items-center justify-center space-x-2 bg-white text-primary px-6 py-3 rounded-full shadow-md hover:bg-gray-50 transition-colors mt-4"
        >
          <Plus size={20} />
          <span className="font-medium">快速记账</span>
        </Link>
      </div>

      {/* 当月收支概览 */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">本月收支</h3>
          <Calendar size={20} className="text-gray-400" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">收入</span>
              <TrendingUp size={18} className="text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">¥{totalIncome.toFixed(2)}</p>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">支出</span>
              <TrendingDown size={18} className="text-red-600" />
            </div>
            <p className="text-2xl font-bold text-red-600">¥{totalExpense.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wallet size={20} className="text-primary" />
              <span className="text-sm text-gray-600">结余</span>
            </div>
            <p className="text-xl font-bold text-gray-800">¥{(totalIncome - totalExpense).toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* 最近交易记录 */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">最近交易</h3>
          <Link to="/statistics" className="text-primary text-sm hover:underline">
            查看全部
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">加载中...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">暂无交易记录</p>
            <p className="text-gray-400 text-sm">点击上方按钮开始记账吧</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {getIconComponent(transaction.categories?.icon || 'more-horizontal')}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{transaction.categories?.name || '未分类'}</p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <div className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'income' ? '+' : '-'}{' ¥' + transaction.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home