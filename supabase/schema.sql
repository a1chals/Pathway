-- PathSearch Supabase Schema
-- Run this in your Supabase SQL Editor to create the tables

-- Companies table - stores company metadata from Aviato
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  aviato_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  country TEXT,
  region TEXT,
  locality TEXT,
  industry_list TEXT[] DEFAULT '{}',
  website TEXT,
  linkedin TEXT,
  employee_count INTEGER,
  founded_year INTEGER,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for fast company lookups
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_companies_aviato_id ON companies(aviato_id);

-- Persons table - stores person data from Aviato
CREATE TABLE IF NOT EXISTS persons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  aviato_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  location TEXT,
  headline TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_persons_aviato_id ON persons(aviato_id);
CREATE INDEX IF NOT EXISTS idx_persons_name ON persons USING gin(to_tsvector('english', full_name));

-- Experiences table - stores work experience from Aviato
CREATE TABLE IF NOT EXISTS experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  person_id TEXT NOT NULL, -- Aviato person ID
  company_id TEXT, -- Aviato company ID (if available)
  company_name TEXT NOT NULL,
  title TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(person_id, company_name, title, start_date)
);

CREATE INDEX IF NOT EXISTS idx_experiences_person ON experiences(person_id);
CREATE INDEX IF NOT EXISTS idx_experiences_company ON experiences(company_name);

-- Exits table - pre-computed exit transitions (main query table)
CREATE TABLE IF NOT EXISTS exits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  person_id TEXT NOT NULL, -- Aviato person ID
  source_company_id TEXT,
  source_company_name TEXT NOT NULL,
  source_role TEXT NOT NULL,
  source_start_date DATE,
  source_end_date DATE,
  exit_company_id TEXT,
  exit_company_name TEXT NOT NULL,
  exit_role TEXT NOT NULL,
  exit_start_date DATE,
  exit_industry TEXT NOT NULL,
  years_at_source NUMERIC(4,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(person_id, source_company_name)
);

-- Indexes for fast exit queries
CREATE INDEX IF NOT EXISTS idx_exits_source_company ON exits(source_company_name);
CREATE INDEX IF NOT EXISTS idx_exits_exit_company ON exits(exit_company_name);
CREATE INDEX IF NOT EXISTS idx_exits_industry ON exits(exit_industry);
CREATE INDEX IF NOT EXISTS idx_exits_source_role ON exits(source_role);

-- Enable Row Level Security (optional, for public read access)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE exits ENABLE ROW LEVEL SECURITY;

-- Allow public read access (adjust as needed)
CREATE POLICY "Allow public read on companies" ON companies FOR SELECT USING (true);
CREATE POLICY "Allow public read on persons" ON persons FOR SELECT USING (true);
CREATE POLICY "Allow public read on experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Allow public read on exits" ON exits FOR SELECT USING (true);

-- Allow authenticated inserts (for API to cache data)
CREATE POLICY "Allow authenticated insert on companies" ON companies FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated insert on persons" ON persons FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated insert on experiences" ON experiences FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated insert on exits" ON exits FOR INSERT WITH CHECK (true);

-- Useful views for quick queries

-- Top exit destinations by company
CREATE OR REPLACE VIEW exit_destinations AS
SELECT 
  source_company_name,
  exit_company_name,
  exit_industry,
  COUNT(*) as exit_count,
  ROUND(AVG(years_at_source), 1) as avg_years,
  array_agg(DISTINCT exit_role) as roles
FROM exits
GROUP BY source_company_name, exit_company_name, exit_industry
ORDER BY exit_count DESC;

-- Industry breakdown by source company
CREATE OR REPLACE VIEW industry_breakdown AS
SELECT 
  source_company_name,
  exit_industry,
  COUNT(*) as count,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY source_company_name), 1) as percentage
FROM exits
GROUP BY source_company_name, exit_industry
ORDER BY source_company_name, count DESC;

-- Function to get exit stats for a company
CREATE OR REPLACE FUNCTION get_exit_stats(company_name_param TEXT)
RETURNS TABLE (
  exit_company TEXT,
  exit_industry TEXT,
  exit_count BIGINT,
  percentage NUMERIC,
  avg_years NUMERIC,
  top_roles TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  WITH total AS (
    SELECT COUNT(*) as total_count 
    FROM exits 
    WHERE source_company_name ILIKE '%' || company_name_param || '%'
  )
  SELECT 
    e.exit_company_name,
    e.exit_industry,
    COUNT(*) as exit_count,
    ROUND(100.0 * COUNT(*) / NULLIF(t.total_count, 0), 1) as percentage,
    ROUND(AVG(e.years_at_source), 1) as avg_years,
    array_agg(DISTINCT e.exit_role) FILTER (WHERE e.exit_role IS NOT NULL) as top_roles
  FROM exits e
  CROSS JOIN total t
  WHERE e.source_company_name ILIKE '%' || company_name_param || '%'
  GROUP BY e.exit_company_name, e.exit_industry, t.total_count
  ORDER BY exit_count DESC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql;

