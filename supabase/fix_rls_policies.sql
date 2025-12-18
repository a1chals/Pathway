-- Fix RLS policies to allow inserts from anon role
-- Run this in Supabase SQL Editor

-- Drop existing insert policies (they might have issues)
DROP POLICY IF EXISTS "Allow authenticated insert on companies" ON companies;
DROP POLICY IF EXISTS "Allow authenticated insert on persons" ON persons;
DROP POLICY IF EXISTS "Allow authenticated insert on experiences" ON experiences;
DROP POLICY IF EXISTS "Allow authenticated insert on exits" ON exits;

-- Create new policies that allow anon role to insert/update
-- (Using anon key for seeding data)

-- Companies
CREATE POLICY "Allow all insert on companies" ON companies 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update on companies" ON companies 
  FOR UPDATE USING (true) WITH CHECK (true);

-- Persons  
CREATE POLICY "Allow all insert on persons" ON persons 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update on persons" ON persons 
  FOR UPDATE USING (true) WITH CHECK (true);

-- Experiences
CREATE POLICY "Allow all insert on experiences" ON experiences 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update on experiences" ON experiences 
  FOR UPDATE USING (true) WITH CHECK (true);

-- Exits
CREATE POLICY "Allow all insert on exits" ON exits 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update on exits" ON exits 
  FOR UPDATE USING (true) WITH CHECK (true);

-- Verify policies are applied
SELECT tablename, policyname, cmd FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

