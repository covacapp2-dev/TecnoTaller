ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS client_name TEXT DEFAULT '';
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS client_phone TEXT DEFAULT '';
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';

DROP POLICY IF EXISTS "Public can insert events" ON calendar_events;
CREATE POLICY "Public can insert events" ON calendar_events FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view vehicles" ON vehicles;
CREATE POLICY "Public can view vehicles" ON vehicles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view orders" ON work_orders;
CREATE POLICY "Public can view orders" ON work_orders FOR SELECT USING (true);