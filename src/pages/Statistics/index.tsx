import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { transactionApi } from '../../services/api/transactions'
import { Transaction } from '../../types'
import { DatePicker, Button, Card, Typography, Empty, Spin } from 'antd'
import { Car, ShoppingBag, Film, Heart, Book, Home as HomeIcon, MoreHorizontal, DollarSign, Gift, TrendingUp, Coffee, Minus } from 'lucide-react'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import * as echarts from 'echarts'
import { CATEGORIES } from '../../constants/categories'

// 设置 dayjs 语言为中文
dayjs.locale('zh-cn')

const Statistics = () => {
  const { user } = useAuth()
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7))
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // 图标映射函数
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'coffee': <Coffee size={16} />,
      'utensils': <Coffee size={16} />,
      'car': <Car size={16} />,
      'shopping-bag': <ShoppingBag size={16} />,
      'film': <Film size={16} />,
      'heart': <Heart size={16} />,
      'book': <Book size={16} />,
      'home': <HomeIcon size={16} />,
      'more-horizontal': <MoreHorizontal size={16} />,
      'dollar-sign': <DollarSign size={16} />,
      'gift': <Gift size={16} />,
      'trending-up': <TrendingUp size={16} />
    }
    return iconMap[iconName] || <MoreHorizontal size={16} />
  }

  // 计算指定月份的开始和结束日期
  const getMonthDates = (month: string) => {
    const [year, monthNum] = month.split('-').map(Number)
    const startDate = new Date(year, monthNum - 1, 1).toISOString().split('T')[0]
    const endDate = new Date(year, monthNum, 0).toISOString().split('T')[0]
    return { startDate, endDate }
  }

  // 获取分类数据（使用常量形式的分类数据）
  const fetchCategories = async () => {
    // 分类数据已经在常量中定义，不需要从 Supabase 获取
  }

  // 获取指定月份的交易数据
  const fetchTransactions = async () => {
    if (!user) return
    
    setLoading(true)
    setError(null)
    
    try {
      const { startDate, endDate } = getMonthDates(selectedMonth)
      console.log('查询参数:', {
        startDate,
        endDate,
        userId: user.id
      })
      const { data, error } = await transactionApi.getTransactions({ startDate, endDate, userId: user.id })
      
      console.log('查询结果:', {
        data,
        error,
        dataLength: data?.length
      })
      
      if (error) {
        throw error
      }
      
      // 检查数据是否包含支出类型的交易
      if (data) {
        const expenseTransactions = data.filter((t: any) => t.type === 'expense')
        console.log('支出交易:', expenseTransactions)
      }
      
      setTransactions(data || [])
    } catch (error: any) {
      setError(error.message || '获取数据失败')
      console.error('获取交易数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 当用户变化时，获取分类数据
  useEffect(() => {
    fetchCategories()
  }, [user])

  // 计算分类占比
  const calculateCategoryStats = () => {
    // 按分类分组计算金额
    const categoryMap = new Map<string, number>()
    
    transactions.forEach(transaction => {
      const currentAmount = categoryMap.get(transaction.category_id) || 0
      categoryMap.set(transaction.category_id, currentAmount + transaction.amount)
    })
    
    // 计算总金额
    const totalAmount = Array.from(categoryMap.values()).reduce((sum, amount) => sum + amount, 0)
    
    // 生成分类统计数据
    const stats = Array.from(categoryMap.entries()).map(([categoryId, amount]) => {
      const category = CATEGORIES.find((c: any) => c.id === categoryId)
      return {
        category_id: categoryId,
        category_name: category?.name || '未知分类',
        icon: category?.icon || 'more-horizontal',
        amount,
        percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0
      }
    })
    
    console.log('分类统计数据:', stats)
    return stats
  }

  // 获取分类占比数据
  const categoryStats = calculateCategoryStats()

  // 计算收支趋势
  const calculateTrendData = () => {
    try {
      // 获取当前月份的天数
      const [year, monthNum] = selectedMonth.split('-').map(Number)
      if (isNaN(year) || isNaN(monthNum)) {
        console.error('月份格式错误:', selectedMonth)
        return []
      }
      
      // 注意：JavaScript 中月份是从 0 开始的，所以需要减 1
      const daysInMonth = new Date(year, monthNum, 0).getDate()
      
      // 初始化每天的收支数据
      const trendData = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1
        const dateStr = `${year}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        return {
          date: dateStr,
          day: day.toString(),
          income: 0,
          expense: 0
        }
      })
      
      console.log('趋势数据初始化:', {
        selectedMonth,
        year,
        monthNum,
        daysInMonth,
        trendDataLength: trendData.length
      })
      
      // 统计每天的收支数据
      console.log('交易数据:', transactions)
      console.log('趋势数据初始化完成，天数:', trendData.length)
      
      transactions.forEach(transaction => {
        try {
          const transactionDate = new Date(transaction.date)
          
          // 验证交易日期是否属于所选月份
          const isInSelectedMonth = 
            transactionDate.getFullYear() === year && 
            transactionDate.getMonth() + 1 === monthNum
          
          if (isInSelectedMonth) {
            const day = transactionDate.getDate() - 1
            console.log('处理交易:', {
              date: transaction.date,
              parsedDate: transactionDate,
              day,
              isInSelectedMonth,
              type: transaction.type,
              amount: transaction.amount
            })
            
            if (day >= 0 && day < trendData.length) {
              if (transaction.type === 'income') {
                trendData[day].income += transaction.amount
                console.log(`✅ 收入统计: 第${day + 1}天收入增加 ${transaction.amount}`)
              } else {
                trendData[day].expense += transaction.amount
                console.log(`✅ 支出统计: 第${day + 1}天支出增加 ${transaction.amount}`)
              }
            } else {
              console.log('❌ 日期超出范围:', { day, trendDataLength: trendData.length })
            }
          } else {
            console.log('❌ 交易日期不在所选月份内:', {
              transactionDate: transactionDate.toISOString(),
              selectedMonth: `${year}-${monthNum}`,
              transactionYear: transactionDate.getFullYear(),
              transactionMonth: transactionDate.getMonth() + 1
            })
          }
        } catch (error) {
          console.error('❌ 日期解析错误:', error, transaction.date)
        }
      })
      
      console.log('最终趋势数据:', trendData)
      
      return trendData
    } catch (error) {
      console.error('计算趋势数据失败:', error)
      return []
    }
  }

  // 获取收支趋势数据
  const trendData = calculateTrendData()
  
  // ECharts 实例引用
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  const pieChartRef = useRef<HTMLDivElement>(null)
  const pieChartInstance = useRef<echarts.ECharts | null>(null)

  const { Title, Text } = Typography

  // 当用户或选择的月份变化时，重新获取交易数据
  useEffect(() => {
    fetchTransactions()
  }, [user, selectedMonth])
  
  // 初始化和更新ECharts图表
  useEffect(() => {
    if (!chartRef.current) return
    
    // 初始化ECharts实例
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current)
    }
    
    // 准备图表数据
    const days = trendData.map(d => d.day)
    const incomeData = trendData.map(d => d.income)
    const expenseData = trendData.map(d => d.expense)
    
    // 图表配置
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          let result = `${params[0].name}日<br/>`
          params.forEach((item: any) => {
            result += `${item.marker}${item.seriesName}: ¥${item.value.toFixed(2)}<br/>`
          })
          return result
        }
      },
      legend: {
        data: ['收入', '支出'],
        top: 10
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: days,
        axisLabel: {
          interval: 0,
          rotate: 45,
          fontSize: 10
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '¥{value}'
        }
      },
      series: [
        {
          name: '收入',
          type: 'bar',
          data: incomeData,
          itemStyle: {
            color: '#10b981' // 绿色
          },
          barWidth: '40%'
        },
        {
          name: '支出',
          type: 'bar',
          data: expenseData,
          itemStyle: {
            color: '#ef4444' // 红色
          },
          barWidth: '40%'
        }
      ]
    }
    
    // 设置图表配置
    chartInstance.current.setOption(option)
    
    // 响应式调整
    const handleResize = () => {
      chartInstance.current?.resize()
      pieChartInstance.current?.resize()
    }
    
    window.addEventListener('resize', handleResize)
    
    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize)
      chartInstance.current?.dispose()
      chartInstance.current = null
    }
  }, [trendData])
  
  // 初始化和更新饼图
  useEffect(() => {
    if (!pieChartRef.current) return
    
    // 初始化ECharts实例
    if (!pieChartInstance.current) {
      pieChartInstance.current = echarts.init(pieChartRef.current)
    }
    
    // 准备饼图数据
    const pieData = categoryStats.map(stat => ({
      name: stat.category_name,
      value: stat.amount
    }))
    
    // 饼图配置
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: ¥{c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        type: 'scroll',
        formatter: (name: string) => {
          const stat = categoryStats.find(s => s.category_name === name)
          return `${name} (¥${stat?.amount.toFixed(2)})`
        },
        textStyle: {
          fontSize: 12
        },
        pageIconSize: 10,
        pageTextStyle: {
          fontSize: 10
        }
      },
      series: [
        {
          name: '分类占比',
          type: 'pie',
          radius: ['35%', '65%'],
          center: ['35%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: pieData
        }
      ]
    }
    
    // 设置饼图配置
    pieChartInstance.current.setOption(option)
    
    // 清理函数
    return () => {
      pieChartInstance.current?.dispose()
      pieChartInstance.current = null
    }
  }, [categoryStats])

  // 计算月度收支平衡
  const calculateBalance = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    return income - expense
  }

  // 计算月度平均每日支出
  const calculateAverageDailyExpense = () => {
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    const [year, monthNum] = selectedMonth.split('-').map(Number)
    const daysInMonth = new Date(year, monthNum, 0).getDate()
    return daysInMonth > 0 ? expense / daysInMonth : 0
  }

  // 计算月度最高支出日
  const calculateHighestExpenseDay = () => {
    const dailyExpense = new Map<string, number>()
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const currentAmount = dailyExpense.get(t.date) || 0
        dailyExpense.set(t.date, currentAmount + t.amount)
      })
    
    let highestDay = ''
    let highestAmount = 0
    dailyExpense.forEach((amount, date) => {
      if (amount > highestAmount) {
        highestAmount = amount
        highestDay = date
      }
    })
    
    return { day: highestDay, amount: highestAmount }
  }

  const balance = calculateBalance()
  const averageDailyExpense = calculateAverageDailyExpense()
  const highestExpenseDay = calculateHighestExpenseDay()

  return (
    <div className="container mx-auto px-4 py-8">
      <Title level={2} className="text-center mb-8">统计分析</Title>
    
      {/* 日期选择 */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <DatePicker
            picker="month"
            value={dayjs(selectedMonth + '-01')}
            onChange={(date) => {
              if (date) {
                setSelectedMonth(date.format('YYYY-MM'))
                // 日期变化时自动获取数据
                fetchTransactions()
              }
            }}
            format="YYYY年MM月"
            style={{ flex: 1 }}
            placeholder="选择月份"
            allowClear={false}
            className="w-full md:w-auto"
          />
          <Button 
            type="primary" 
            onClick={fetchTransactions}
            className="w-full md:w-auto"
          >
            查看
          </Button>
        </div>
        {error && <Text type="danger" className="mt-2">{error}</Text>}
      </div>
      
      {/* 收支概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-green-600 text-4xl mb-2">
              <DollarSign size={32} />
            </div>
            <Title level={4}>总收入</Title>
            <Text strong className="text-2xl text-green-600 mt-2">
              ¥{transactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0)
                .toFixed(2)}
            </Text>
          </div>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-red-600 text-4xl mb-2">
              <Minus size={32} />
            </div>
            <Title level={4}>总支出</Title>
            <Text strong className="text-2xl text-red-600 mt-2">
              ¥{transactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0)
                .toFixed(2)}
            </Text>
          </div>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center justify-center py-4">
            <div className={`text-${balance >= 0 ? 'green' : 'red'}-600 text-4xl mb-2`}>
              <TrendingUp size={32} />
            </div>
            <Title level={4}>收支平衡</Title>
            <Text strong className={`text-2xl text-${balance >= 0 ? 'green' : 'red'}-600 mt-2`}>
              {balance >= 0 ? '+' : ''}¥{balance.toFixed(2)}
            </Text>
          </div>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-blue-600 text-4xl mb-2">
              <Coffee size={32} />
            </div>
            <Title level={4}>日均支出</Title>
            <Text strong className="text-2xl text-blue-600 mt-2">
              ¥{averageDailyExpense.toFixed(2)}
            </Text>
          </div>
        </Card>
      </div>
      
      {/* 统计图表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* 收支趋势图 */}
        <Card title="收支趋势" className="shadow-md">
          <div className="h-72">
            {trendData.length === 0 ? (
              <Empty description="暂无数据" />
            ) : (
              <div ref={chartRef} className="w-full h-full"></div>
            )}
          </div>
        </Card>
        
        {/* 分类占比图 */}
        <Card title="分类占比" className="shadow-md">
          <div className="h-72">
            {categoryStats.length === 0 ? (
              <Empty description="暂无数据" />
            ) : (
              <div ref={pieChartRef} className="w-full h-full"></div>
            )}
          </div>
        </Card>
      </div>
      
      {/* 消费分析 */}
      <div className="mb-8">
        <Title level={3}>消费分析</Title>
        <Card className="shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Title level={4}>最高支出日</Title>
              {highestExpenseDay.amount > 0 ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong>日期: {new Date(highestExpenseDay.day).toLocaleDateString()}</Text>
                  <Text strong className="block mt-2 text-red-600">
                    支出: ¥{highestExpenseDay.amount.toFixed(2)}
                  </Text>
                </div>
              ) : (
                <Empty description="暂无数据" />
              )}
            </div>
            <div>
              <Title level={4}>消费趋势</Title>
              <div className="bg-gray-50 p-4 rounded-lg">
                <Text>本月共 {transactions.filter(t => t.type === 'expense').length} 笔支出</Text>
                <Text className="block mt-2">平均每笔支出: ¥{(transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) / (transactions.filter(t => t.type === 'expense').length || 1)).toFixed(2)}</Text>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* 收支明细 */}
      <div className="mt-8">
        <Title level={3}>收支明细</Title>
        <Card className="shadow-md">
          {loading ? (
            <div className="flex justify-center py-8">
              <Spin size="large" />
            </div>
          ) : transactions.length === 0 ? (
            <Empty description="暂无数据" />
          ) : (
            <div className="space-y-4">
              {transactions.map(transaction => {
                const category = CATEGORIES.find((c: any) => c.id === transaction.category_id)
                return (
                  <div key={transaction.id} className="flex justify-between items-center py-3 border-b hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <span className="p-2 rounded-full bg-gray-100">
                        {getIconComponent(category?.icon || 'more-horizontal')}
                      </span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <Text strong>
                            {transaction.type === 'income' ? '收入' : '支出'}
                          </Text>
                          <Text type="secondary" className="text-sm">
                            {category?.name || '未知分类'}
                          </Text>
                        </div>
                        <Text type="secondary" className="block mt-1 text-sm">
                          {new Date(transaction.date).toLocaleDateString()}
                          {transaction.note && ` - ${transaction.note}`}
                        </Text>
                      </div>
                    </div>
                    <Text strong className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                      {transaction.type === 'income' ? '+' : '-'}
                      ¥{transaction.amount.toFixed(2)}
                    </Text>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>
      </div>
  )
}

export default Statistics