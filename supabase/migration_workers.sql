ALTER TABLE workers ADD COLUMN IF NOT EXISTS dni TEXT DEFAULT '';
ALTER TABLE workers ADD COLUMN IF NOT EXISTS doc_type TEXT DEFAULT 'DNI';
ALTER TABLE workers ADD COLUMN IF NOT EXISTS address TEXT DEFAULT '';
ALTER TABLE workers ADD COLUMN IF NOT EXISTS commission DECIMAL(5,2) DEFAULT 0;
ALTER TABLE workers ADD COLUMN IF NOT EXISTS task TEXT DEFAULT 'mecanico';
ALTER TABLE workers ADD COLUMN IF NOT EXISTS phone_alt TEXT DEFAULT '';

CREATE TABLE IF NOT EXISTS worker_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  concept TEXT NOT NULL DEFAULT '',
  amount DECIMAL(12,2) DEFAULT 0,
  method TEXT DEFAULT 'efectivo',
  discount_from_cash BOOLEAN DEFAULT false,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE worker_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own worker payments" ON worker_payments FOR ALL USING (user_id = auth.uid());