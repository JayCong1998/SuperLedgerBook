// 交易类型
export type TransactionType = 'income' | 'expense'

// 交易记录接口
export interface Transaction {
  id: string
  amount: number
  type: TransactionType
  category_id: string
  date: string
  note?: string
  user_id: string
  created_at: string
  updated_at: string
}

// 分类接口
export interface Category {
  id: string
  name: string
  type: TransactionType
  icon?: string
  user_id?: string
  created_at: string
}

// 用户接口
export interface User {
  id: string
  username: string
  avatar?: string
  created_at: string
  updated_at: string
}

// 统计数据接口
export interface Statistics {
  totalIncome: number
  totalExpense: number
  categoryStats: CategoryStat[]
}

// 分类统计接口
export interface CategoryStat {
  category_id: string
  category_name: string
  amount: number
  percentage: number
}
