import { supabase } from '../supabase'

export const transactionApi = {
  getTransactions: async (params?: { startDate?: string; endDate?: string; categoryId?: string }) => {
    let query = supabase.from('transactions').select('*')

    if (params?.startDate) {
      query = query.gte('date', params.startDate)
    }

    if (params?.endDate) {
      query = query.lte('date', params.endDate)
    }

    if (params?.categoryId) {
      query = query.eq('category_id', params.categoryId)
    }

    const { data, error } = await query.order('date', { ascending: false })
    return { data, error }
  },

  createTransaction: async (data: {
    amount: number
    type: 'income' | 'expense'
    category_id: string
    date: string
    note?: string
  }) => {
    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert(data)
      .select()
      .single()
    return { data: transaction, error }
  },

  getTransaction: async (id: string) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },

  updateTransaction: async (id: string, data: Partial<{
    amount: number
    type: 'income' | 'expense'
    category_id: string
    date: string
    note?: string
  }>) => {
    const { data: transaction, error } = await supabase
      .from('transactions')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    return { data: transaction, error }
  },

  deleteTransaction: async (id: string) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
    return { error }
  },

  getStatistics: async (startDate: string, endDate: string) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('amount, type, category_id')
      .gte('date', startDate)
      .lte('date', endDate)
    return { data, error }
  }
}
