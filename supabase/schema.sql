
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  state VARCHAR(100),
  farm_size_hectares DECIMAL(10, 2),
  preferred_language VARCHAR(20) DEFAULT 'en',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Soil Tests table
CREATE TABLE IF NOT EXISTS soil_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nitrogen DECIMAL(10, 2),
  phosphorus DECIMAL(10, 2),
  potassium DECIMAL(10, 2),
  ph DECIMAL(4, 2),
  organic_matter DECIMAL(5, 2),
  moisture DECIMAL(5, 2),
  texture VARCHAR(50),
  soil_health_score DECIMAL(5, 2),
  recommendations TEXT,
  suitable_crops TEXT[],
  test_date TIMESTAMP,
  location_coordinates POINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fertilizer Applications table
CREATE TABLE IF NOT EXISTS fertilizer_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  soil_test_id UUID REFERENCES soil_tests(id),
  crop_type VARCHAR(100),
  growth_stage VARCHAR(50),
  fertilizer_product VARCHAR(255),
  quantity_kg DECIMAL(10, 2),
  cost_per_kg DECIMAL(10, 2),
  total_cost DECIMAL(12, 2),
  application_date TIMESTAMP,
  expected_yield_increase DECIMAL(5, 2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Irrigation Schedules table
CREATE TABLE IF NOT EXISTS irrigation_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  crop_type VARCHAR(100),
  season VARCHAR(50),
  irrigation_sequence INTEGER,
  day_after_sowing INTEGER,
  depth_mm DECIMAL(5, 2),
  method VARCHAR(50),
  duration_hours DECIMAL(5, 2),
  expected_cost DECIMAL(10, 2),
  water_savings_percent DECIMAL(5, 2),
  schedule_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Disease Detections table
CREATE TABLE IF NOT EXISTS disease_detections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  crop_type VARCHAR(100),
  disease_name VARCHAR(255),
  confidence_score DECIMAL(5, 2),
  severity VARCHAR(50),
  urgency VARCHAR(50),
  image_url TEXT,
  symptoms TEXT,
  treatments TEXT,
  prevention_measures TEXT,
  treatment_cost DECIMAL(10, 2),
  detection_date TIMESTAMP,
  follow_up_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loan Applications table
CREATE TABLE IF NOT EXISTS loan_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scheme_name VARCHAR(255),
  provider VARCHAR(255),
  loan_amount DECIMAL(15, 2),
  interest_rate DECIMAL(5, 2),
  loan_term_months INTEGER,
  monthly_emi DECIMAL(12, 2),
  status VARCHAR(50) DEFAULT 'draft',
  application_number VARCHAR(100),
  approved_amount DECIMAL(15, 2),
  disbursement_date TIMESTAMP,
  submission_date TIMESTAMP,
  documents_submitted TEXT[],
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- IoT Sensors table
CREATE TABLE IF NOT EXISTS iot_sensors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sensor_type VARCHAR(100),
  sensor_name VARCHAR(255),
  protocol VARCHAR(50),
  device_id VARCHAR(255),
  location_coordinates POINT,
  battery_level DECIMAL(5, 2),
  signal_strength DECIMAL(5, 2),
  last_reading_value DECIMAL(15, 4),
  last_reading_timestamp TIMESTAMP,
  unit VARCHAR(50),
  min_threshold DECIMAL(15, 4),
  max_threshold DECIMAL(15, 4),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sensor Readings table
CREATE TABLE IF NOT EXISTS sensor_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sensor_id UUID NOT NULL REFERENCES iot_sensors(id) ON DELETE CASCADE,
  reading_value DECIMAL(15, 4),
  unit VARCHAR(50),
  timestamp TIMESTAMP,
  alert_triggered BOOLEAN DEFAULT false,
  alert_severity VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Community Forum Posts table
CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  content TEXT,
  category VARCHAR(100),
  crop_type VARCHAR(100),
  region VARCHAR(100),
  views INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Forum Comments table
CREATE TABLE IF NOT EXISTS forum_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS soil_tests_user_id_idx ON soil_tests(user_id);
CREATE INDEX IF NOT EXISTS soil_tests_test_date_idx ON soil_tests(test_date);
CREATE INDEX IF NOT EXISTS fertilizer_user_id_idx ON fertilizer_applications(user_id);
CREATE INDEX IF NOT EXISTS irrigation_user_id_idx ON irrigation_schedules(user_id);
CREATE INDEX IF NOT EXISTS disease_user_id_idx ON disease_detections(user_id);
CREATE INDEX IF NOT EXISTS disease_detection_date_idx ON disease_detections(detection_date);
CREATE INDEX IF NOT EXISTS loan_user_id_idx ON loan_applications(user_id);
CREATE INDEX IF NOT EXISTS loan_status_idx ON loan_applications(status);
CREATE INDEX IF NOT EXISTS sensors_user_id_idx ON iot_sensors(user_id);
CREATE INDEX IF NOT EXISTS readings_sensor_id_idx ON sensor_readings(sensor_id);
CREATE INDEX IF NOT EXISTS readings_timestamp_idx ON sensor_readings(timestamp);
CREATE INDEX IF NOT EXISTS forum_posts_category_idx ON forum_posts(category);
CREATE INDEX IF NOT EXISTS forum_comments_post_id_idx ON forum_comments(post_id);

-- Create views for analytics
CREATE OR REPLACE VIEW soil_health_trends AS
SELECT 
  user_id,
  DATE_TRUNC('month', test_date)::date as month,
  AVG(soil_health_score) as avg_score,
  COUNT(*) as test_count
FROM soil_tests
GROUP BY user_id, DATE_TRUNC('month', test_date)
ORDER BY month DESC;

CREATE OR REPLACE VIEW user_farm_metrics AS
SELECT 
  u.id,
  u.email,
  u.state,
  u.farm_size_hectares,
  COUNT(DISTINCT s.id) as total_soil_tests,
  COUNT(DISTINCT f.id) as total_fertilizer_apps,
  COUNT(DISTINCT i.id) as total_irrigations,
  COUNT(DISTINCT d.id) as total_disease_detections,
  COUNT(DISTINCT l.id) as total_loan_applications,
  AVG(s.soil_health_score) as avg_soil_health
FROM users u
LEFT JOIN soil_tests s ON u.id = s.user_id
LEFT JOIN fertilizer_applications f ON u.id = f.user_id
LEFT JOIN irrigation_schedules i ON u.id = i.user_id
LEFT JOIN disease_detections d ON u.id = d.user_id
LEFT JOIN loan_applications l ON u.id = l.user_id
GROUP BY u.id, u.email, u.state, u.farm_size_hectares;

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE soil_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE fertilizer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE irrigation_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE disease_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE iot_sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
DROP POLICY IF EXISTS "Users can access own data" ON soil_tests;
CREATE POLICY "Users can access own data" ON soil_tests
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own data" ON soil_tests;
CREATE POLICY "Users can insert own data" ON soil_tests
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own data" ON soil_tests;
CREATE POLICY "Users can update own data" ON soil_tests
  USING (auth.uid() = user_id);

-- Similar policies for other tables...
