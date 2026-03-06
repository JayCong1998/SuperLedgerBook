import { supabase } from '../supabase'

export const categoryApi = {
  getCategories: async (type?: 'income' | 'expense') => {
    let query = supabase.from('categories').select('*')

    if (type) {
      query = query.eq('type', type)
    }

    const { data, error } = await query
    return { data, error }
  },

  createCategory: async (data: {
    name: string
    type: 'income' | 'expense'
    icon?: string
  }) => {
    const { data: category, error } = await supabase
      .from('categories')
      .insert(data)
      .select()
      .single()
    return { data: category, error }
  },

  updateCategory: async (id: string, data: Partial<{
    name: string
    icon?: string
  }>) => {
    const { data: category, error } = await supabase
      .from('categories')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    return { data: category, error }
  },

  deleteCategory: async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
    return { error }
  }
}
