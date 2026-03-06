-- 记账应用数据库脚本

-- 1. 用户表（由Supabase Auth自动创建）
-- 注意：auth.users表由Supabase Auth服务自动管理，无需手动创建

-- 2. 分类表
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    icon TEXT,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. 交易记录表
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    amount REAL NOT NULL CHECK (amount > 0),
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    category_id UUID REFERENCES public.categories(id),
    date DATE NOT NULL,
    note TEXT,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. 创建索引
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON public.categories(user_id);

-- 5. 插入预设分类数据
INSERT INTO public.categories (name, type, icon, user_id) VALUES
-- 支出分类
('餐饮', 'expense', 'utensils', NULL),
('交通', 'expense', 'car', NULL),
('购物', 'expense', 'shopping-bag', NULL),
('娱乐', 'expense', 'film', NULL),
('医疗', 'expense', 'heart', NULL),
('教育', 'expense', 'book', NULL),
('住房', 'expense', 'home', NULL),
('其他支出', 'expense', 'more-horizontal', NULL),
-- 收入分类
('工资', 'income', 'dollar-sign', NULL),
('奖金', 'income', 'gift', NULL),
('投资收益', 'income', 'trending-up', NULL),
('其他收入', 'income', 'more-horizontal', NULL)
ON CONFLICT DO NOTHING;

-- 6. 配置Row Level Security (RLS)

-- 为分类表启用RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 分类表的RLS策略
CREATE POLICY "Users can view all categories" ON public.categories
    FOR SELECT USING (
        user_id IS NULL OR user_id = auth.uid()
    );

CREATE POLICY "Users can create their own categories" ON public.categories
    FOR INSERT WITH CHECK (
        user_id = auth.uid()
    );

CREATE POLICY "Users can update their own categories" ON public.categories
    FOR UPDATE USING (
        user_id = auth.uid()
    );

CREATE POLICY "Users can delete their own categories" ON public.categories
    FOR DELETE USING (
        user_id = auth.uid()
    );

-- 为交易记录表启用RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 交易记录表的RLS策略
CREATE POLICY "Users can view their own transactions" ON public.transactions
    FOR SELECT USING (
        user_id = auth.uid()
    );

CREATE POLICY "Users can create their own transactions" ON public.transactions
    FOR INSERT WITH CHECK (
        user_id = auth.uid()
    );

CREATE POLICY "Users can update their own transactions" ON public.transactions
    FOR UPDATE USING (
        user_id = auth.uid()
    );

CREATE POLICY "Users can delete their own transactions" ON public.transactions
    FOR DELETE USING (
        user_id = auth.uid()
    );

-- 7. 函数：更新交易记录的updated_at字段
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为交易记录表创建触发器
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
