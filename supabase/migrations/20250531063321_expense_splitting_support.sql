-- Add support for complex expense splitting with multiple payers and custom debt allocation

-- Drop and recreate trip_expenses table with better structure
DROP TABLE IF EXISTS trip_expenses CASCADE;

CREATE TABLE trip_expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  total_amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  expense_date DATE NOT NULL,
  category VARCHAR(50) DEFAULT 'other',
  created_by UUID NOT NULL,
  created_by_name VARCHAR(255),
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create expense_payers table to track who paid for each expense
CREATE TABLE expense_payers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  expense_id UUID NOT NULL REFERENCES trip_expenses(id) ON DELETE CASCADE,
  participant_id VARCHAR(255) NOT NULL, -- Can be participant ID or name
  participant_name VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create expense_debtors table to track who owes what for each expense
CREATE TABLE expense_debtors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  expense_id UUID NOT NULL REFERENCES trip_expenses(id) ON DELETE CASCADE,
  participant_id VARCHAR(255) NOT NULL, -- Can be participant ID or name
  participant_name VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX idx_trip_expenses_trip_id ON trip_expenses(trip_id);
CREATE INDEX idx_trip_expenses_created_by ON trip_expenses(created_by);
CREATE INDEX idx_expense_payers_expense_id ON expense_payers(expense_id);
CREATE INDEX idx_expense_debtors_expense_id ON expense_debtors(expense_id);

-- Add Row Level Security (RLS)
ALTER TABLE trip_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_payers ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_debtors ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trip_expenses
CREATE POLICY "Users can view expenses for trips they participate in" ON trip_expenses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM trip_participants tp 
      WHERE tp.trip_id = trip_expenses.trip_id 
      AND tp.user_id = auth.uid()
    )
    OR trip_id IN (
      SELECT id FROM trips WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create expenses for trips they participate in" ON trip_expenses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM trip_participants tp 
      WHERE tp.trip_id = trip_expenses.trip_id 
      AND tp.user_id = auth.uid()
    )
    OR trip_id IN (
      SELECT id FROM trips WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update their own expenses" ON trip_expenses
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own expenses" ON trip_expenses
  FOR DELETE USING (created_by = auth.uid());

-- RLS Policies for expense_payers
CREATE POLICY "Users can view payers for expenses they can see" ON expense_payers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM trip_expenses te
      JOIN trip_participants tp ON tp.trip_id = te.trip_id
      WHERE te.id = expense_payers.expense_id
      AND tp.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM trip_expenses te
      JOIN trips t ON t.id = te.trip_id
      WHERE te.id = expense_payers.expense_id
      AND t.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can manage payers for expenses they create" ON expense_payers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM trip_expenses te
      WHERE te.id = expense_payers.expense_id
      AND te.created_by = auth.uid()
    )
  );

-- RLS Policies for expense_debtors
CREATE POLICY "Users can view debtors for expenses they can see" ON expense_debtors
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM trip_expenses te
      JOIN trip_participants tp ON tp.trip_id = te.trip_id
      WHERE te.id = expense_debtors.expense_id
      AND tp.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM trip_expenses te
      JOIN trips t ON t.id = te.trip_id
      WHERE te.id = expense_debtors.expense_id
      AND t.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can manage debtors for expenses they create" ON expense_debtors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM trip_expenses te
      WHERE te.id = expense_debtors.expense_id
      AND te.created_by = auth.uid()
    )
  );

-- Function to get expense details with payers and debtors
CREATE OR REPLACE FUNCTION get_expense_details(expense_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'expense', row_to_json(te),
    'payers', COALESCE(payers.payers_array, '[]'::json),
    'debtors', COALESCE(debtors.debtors_array, '[]'::json)
  ) INTO result
  FROM trip_expenses te
  LEFT JOIN (
    SELECT 
      expense_id,
      json_agg(json_build_object(
        'participantId', participant_id,
        'name', participant_name,
        'amount', amount
      )) as payers_array
    FROM expense_payers 
    WHERE expense_id = expense_uuid
    GROUP BY expense_id
  ) payers ON payers.expense_id = te.id
  LEFT JOIN (
    SELECT 
      expense_id,
      json_agg(json_build_object(
        'participantId', participant_id,
        'name', participant_name,
        'amount', amount
      )) as debtors_array
    FROM expense_debtors 
    WHERE expense_id = expense_uuid
    GROUP BY expense_id
  ) debtors ON debtors.expense_id = te.id
  WHERE te.id = expense_uuid;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert some dummy data for testing
INSERT INTO trip_expenses (trip_id, title, description, total_amount, expense_date, category, created_by, created_by_name)
SELECT 
  t.id,
  'Hotel Booking',
  'Shared accommodation for the trip',
  300.00,
  '2024-03-15',
  'accommodation',
  t.created_by,
  'John Doe'
FROM trips t
LIMIT 1;

INSERT INTO trip_expenses (trip_id, title, description, total_amount, expense_date, category, created_by, created_by_name)
SELECT 
  t.id,
  'Group Dinner',
  'Welcome dinner at local restaurant',
  150.00,
  '2024-03-16',
  'food',
  t.created_by,
  'Jane Smith'
FROM trips t
LIMIT 1;

INSERT INTO trip_expenses (trip_id, title, description, total_amount, expense_date, category, created_by, created_by_name)
SELECT 
  t.id,
  'Museum Tickets',
  'Entry tickets to the city museum',
  80.00,
  '2024-03-17',
  'activities',
  t.created_by,
  'Bob Johnson'
FROM trips t
LIMIT 1;

-- Add payers for the dummy expenses
INSERT INTO expense_payers (expense_id, participant_id, participant_name, amount)
SELECT 
  te.id,
  '1',
  'John Doe',
  300.00
FROM trip_expenses te
WHERE te.title = 'Hotel Booking'
LIMIT 1;

INSERT INTO expense_payers (expense_id, participant_id, participant_name, amount)
SELECT 
  te.id,
  '2',
  'Jane Smith',
  150.00
FROM trip_expenses te
WHERE te.title = 'Group Dinner'
LIMIT 1;

INSERT INTO expense_payers (expense_id, participant_id, participant_name, amount)
SELECT 
  te.id,
  '3',
  'Bob Johnson',
  80.00
FROM trip_expenses te
WHERE te.title = 'Museum Tickets'
LIMIT 1;

-- Add debtors for the dummy expenses (equal splits)
INSERT INTO expense_debtors (expense_id, participant_id, participant_name, amount)
SELECT 
  te.id,
  participant_id,
  participant_name,
  100.00
FROM trip_expenses te
CROSS JOIN (
  VALUES 
    ('1', 'John Doe'),
    ('2', 'Jane Smith'),
    ('3', 'Bob Johnson')
) AS participants(participant_id, participant_name)
WHERE te.title = 'Hotel Booking';

INSERT INTO expense_debtors (expense_id, participant_id, participant_name, amount)
SELECT 
  te.id,
  participant_id,
  participant_name,
  50.00
FROM trip_expenses te
CROSS JOIN (
  VALUES 
    ('1', 'John Doe'),
    ('2', 'Jane Smith'),
    ('3', 'Bob Johnson')
) AS participants(participant_id, participant_name)
WHERE te.title = 'Group Dinner';

INSERT INTO expense_debtors (expense_id, participant_id, participant_name, amount)
SELECT 
  te.id,
  participant_id,
  participant_name,
  40.00
FROM trip_expenses te
CROSS JOIN (
  VALUES 
    ('1', 'John Doe'),
    ('3', 'Bob Johnson')
) AS participants(participant_id, participant_name)
WHERE te.title = 'Museum Tickets';
