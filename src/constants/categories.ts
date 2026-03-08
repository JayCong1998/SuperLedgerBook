export const CATEGORIES = [
  { id: '1', name: '餐饮', icon: 'coffee', type: 'expense' },
  { id: '2', name: '交通', icon: 'car', type: 'expense' },
  { id: '3', name: '购物', icon: 'shopping-bag', type: 'expense' },
  { id: '4', name: '娱乐', icon: 'film', type: 'expense' },
  { id: '5', name: '医疗', icon: 'heart', type: 'expense' },
  { id: '6', name: '教育', icon: 'book', type: 'expense' },
  { id: '7', name: '住房', icon: 'home', type: 'expense' },
  { id: '8', name: '其他支出', icon: 'more-horizontal', type: 'expense' },
  { id: '9', name: '工资', icon: 'dollar-sign', type: 'income' },
  { id: '10', name: '奖金', icon: 'gift', type: 'income' },
  { id: '11', name: '投资收益', icon: 'trending-up', type: 'income' },
  { id: '12', name: '其他收入', icon: 'more-horizontal', type: 'income' }
]

export const getCategoryById = (id: string) => {
  return CATEGORIES.find(category => category.id === id)
}

export const getCategoriesByType = (type: 'income' | 'expense') => {
  return CATEGORIES.filter(category => category.type === type)
}