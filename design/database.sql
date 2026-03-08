-- 记账应用数据库脚本

-- 1. 用户表（由Supabase Auth自动创建）
-- 注意：auth.users表由Supabase Auth服务自动管理，无需手动创建

-- 2. 交易记录表
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    amount REAL NOT NULL CHECK (amount > 0),
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    category_id VARCHAR,
    date DATE NOT NULL,
    note TEXT,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. 创建索引
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date);

-- 4. 配置Row Level Security (RLS)

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

-- 5. 函数：更新交易记录的updated_at字段
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
