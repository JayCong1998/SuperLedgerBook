import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { transactionApi } from '../../services/api/transactions'
import { Plus, Minus, Car, ShoppingBag, Film, Heart, Book, Home, MoreHorizontal, DollarSign, Gift, TrendingUp, Coffee } from 'lucide-react'
import { Button, Input, DatePicker, Card, Form, Alert, Typography, Radio, Space } from 'antd'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { getCategoriesByType } from '../../constants/categories'

// 设置 dayjs 语言为中文
dayjs.locale('zh-cn')

const AddTransaction = () => {
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState(dayjs())
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { user } = useAuth()

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
      'home': <Home size={20} />,
      'more-horizontal': <MoreHorizontal size={20} />,
      'dollar-sign': <DollarSign size={20} />,
      'gift': <Gift size={20} />,
      'trending-up': <TrendingUp size={20} />
    }
    return iconMap[iconName] || <MoreHorizontal size={20} />
  }

  // 过滤当前交易类型的分类
  const filteredCategories = getCategoriesByType(transactionType)

  const handleSubmit = async () => {
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
      const { error } = await transactionApi.createTransaction({
        amount: parseFloat(amount),
        type: transactionType,
        category_id: categoryId,
        date: date.format('YYYY-MM-DD'),
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

  const { Title } = Typography

  return (
    <div className="container mx-auto px-4 py-6">
      <Title level={2}>添加交易</Title>
    
      <Card>
        {/* 错误提示 */}
        {error && (
          <Alert 
            message={error} 
            type="error" 
            showIcon 
            className="mb-4"
          />
        )}
        
        <Form onFinish={handleSubmit}>
          {/* 交易类型选择 */}
          <Form.Item className="mb-6">
            <Radio.Group 
              value={transactionType} 
              onChange={(e) => setTransactionType(e.target.value as 'income' | 'expense')}
              className="w-full"
              optionType="button"
              buttonStyle="solid"
              size="large"
            >
              <Space direction="horizontal" style={{ width: '100%' }}>
                <Radio.Button value="income" className="flex-1">
                  <Space size="middle">
                    <Plus size={18} />
                    <span className="text-lg font-medium">收入</span>
                  </Space>
                </Radio.Button>
                <Radio.Button value="expense" className="flex-1">
                  <Space size="middle">
                    <Minus size={18} />
                    <span className="text-lg font-medium">支出</span>
                  </Space>
                </Radio.Button>
              </Space>
            </Radio.Group>
          </Form.Item>
          
          {/* 金额输入 */}
          <Form.Item 
            label="金额" 
            className="mb-6"
            rules={[
              { required: true, message: '请输入金额' },
              { pattern: /^\d+(\.\d{1,2})?$/, message: '请输入有效的金额' }
            ]}
          >
            <Input
              prefix="¥"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              size="large"
              style={{ fontSize: '1.5rem' }}
            />
          </Form.Item>
          
          {/* 分类选择 */}
          <Form.Item 
            label="分类" 
            className="mb-6"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <div className="grid grid-cols-4 gap-3">
              {filteredCategories.map((category) => (
                <Button
                  key={category.id}
                  type={categoryId === category.id ? 'primary' : 'default'}
                  onClick={() => setCategoryId(category.id)}
                  className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 ${categoryId === category.id ? 'bg-primary text-white shadow-md' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
                  style={{ height: '100px' }}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${categoryId === category.id ? 'bg-white text-primary' : 'bg-gray-100 text-gray-600'}`}>
                    {getIconComponent(category.icon)}
                  </div>
                  <span className="text-xs text-center">{category.name}</span>
                </Button>
              ))}
            </div>
          </Form.Item>
          
          {/* 日期选择 */}
          <Form.Item 
            label="日期" 
            className="mb-6"
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <DatePicker
              value={date}
              onChange={(date) => setDate(date || dayjs())}
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
              size="large"
              allowClear={false}
              className="rounded-lg"
            />
          </Form.Item>
          
          {/* 备注 */}
          <Form.Item label="备注" className="mb-6">
            <Input.TextArea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="添加备注..."
              size="large"
              className="rounded-lg"
            />
          </Form.Item>
          
          {/* 提交按钮 */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              className="rounded-lg py-4 text-lg font-medium transition-all duration-200 hover:shadow-lg"
            >
              {loading ? '保存中...' : '保存'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
      </div>
  )
}

export default AddTransaction