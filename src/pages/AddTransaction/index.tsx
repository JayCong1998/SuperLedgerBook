import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Calendar, Plus, Minus, Utensils, Car, ShoppingBag, Film, Heart, Book, Home as HomeIcon, MoreHorizontal, DollarSign, Gift, TrendingUp } from 'lucide-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const AddTransaction = () => {
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState(new Date())
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const navigate = useNavigate()
  const { user } = useAuth()

  // 图标映射函数
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'utensils': <Utensils size={20} />,
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

  // 加载分类列表
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, icon, type')
          .order('name', { ascending: true })
        
        if (error) {
          throw error
        }
        
        setCategories(data)
      } catch (error) {
        console.error('加载分类失败:', error)
      }
    }

    loadCategories()
  }, [])

  // 过滤当前交易类型的分类
  const filteredCategories = categories.filter(category => category.type === transactionType)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // 表单验证
    if (!amount || parseFloat(amount) <= 0) {
      setError('请输入有效的金额')
      setLoading(false)
      return
    }

    if (!categoryId) {
      setError('请选择分类')
      setLoading(false)
      return
    }

    if (!user) {
      setError('请先登录')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          amount: parseFloat(amount),
          type: transactionType,
          category_id: categoryId,
          date: date.toISOString().split('T')[0],
          note,
          user_id: user.id
        })

      if (error) {
        throw error
      }

      // 记账成功，跳转到首页
      navigate('/')
    } catch (error: any) {
      setError(error.message || '记账失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">添加交易</h2>
      </div>
      
      <div className="bg-white rounded-2xl shadow-md p-6">
        {/* 错误提示 */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* 交易类型选择 */}
          <div className="flex mb-6 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setTransactionType('income')}
              className={`flex-1 py-3 font-medium transition-colors ${transactionType === 'income' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Plus size={18} />
                <span>收入</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setTransactionType('expense')}
              className={`flex-1 py-3 font-medium transition-colors ${transactionType === 'expense' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Minus size={18} />
                <span>支出</span>
              </div>
            </button>
          </div>
          
          {/* 金额输入 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">金额</label>
            <div className="relative">
              <span className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 text-xl">¥</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-2xl border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>
          
          {/* 分类选择 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">分类</label>
            <div className="grid grid-cols-4 gap-3">
              {filteredCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setCategoryId(category.id)}
                  className={`flex flex-col items-center p-3 rounded-lg transition-colors ${categoryId === category.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'}`}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2">
                    {getIconComponent(category.icon)}
                  </div>
                  <span className="text-xs text-center">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* 日期选择 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">日期</label>
            <div className="relative">
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date || new Date())}
                dateFormat="yyyy-MM-dd"
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                popperPlacement="bottom-start"
                todayButton="今天"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              />
              <Calendar size={20} className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          {/* 备注 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full py-4 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none"
              rows={3}
              placeholder="添加备注..."
            ></textarea>
          </div>
          
          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            {loading ? '保存中...' : '保存'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddTransaction