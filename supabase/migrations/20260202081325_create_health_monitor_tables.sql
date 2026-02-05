/*
  # Health Monitor Database Schema

  ## Overview
  Creates tables for tracking health metrics and user goals in a health monitoring application.

  ## New Tables
  
  ### health_metrics
  Stores daily health data entries for users.
  - id (uuid, primary key) - Unique identifier for each health entry
  - user_id (uuid) - Reference to the authenticated user
  - date (date) - Date of the health entry
  - steps (integer) - Number of steps taken
  - water_intake (decimal) - Water consumed in liters
  - weight (decimal) - Weight in kilograms
  - sleep_hours (decimal) - Hours of sleep
  - created_at (timestamptz) - Record creation timestamp
  - updated_at (timestamptz) - Record update timestamp

  ### user_goals
  Stores daily health goals for users.
  - id (uuid, primary key) - Unique identifier
  - user_id (uuid) - Reference to the authenticated user
  - steps_goal (integer) - Daily steps goal (default: 10000)
  - water_goal (decimal) - Daily water intake goal in liters (default: 2.5)
  - weight_goal (decimal) - Target weight in kilograms
  - sleep_goal (decimal) - Daily sleep hours goal (default: 8.0)
  - created_at (timestamptz) - Record creation timestamp
  - updated_at (timestamptz) - Record update timestamp

  ## Security
  - Enable Row Level Security (RLS) on both tables
  - Users can only access their own health metrics and goals
  - Policies for SELECT, INSERT, UPDATE, and DELETE operations
  - All operations require authentication

  ## Indexes
  - Index on (user_id, date) for efficient queries
  - Unique constraint on (user_id, date) to prevent duplicate entries per day
  - Index on user_id for goals table
*/

CREATE TABLE IF NOT EXISTS health_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  steps integer DEFAULT 0,
  water_intake decimal(5,2) DEFAULT 0,
  weight decimal(5,2) DEFAULT 0,
  sleep_hours decimal(4,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_date UNIQUE (user_id, date)
);

CREATE TABLE IF NOT EXISTS user_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  steps_goal integer DEFAULT 10000,
  water_goal decimal(5,2) DEFAULT 2.5,
  weight_goal decimal(5,2) DEFAULT 70.0,
  sleep_goal decimal(4,2) DEFAULT 8.0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_health_metrics_user_date ON health_metrics(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_user_goals_user_id ON user_goals(user_id);

ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own health metrics"
  ON health_metrics FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health metrics"
  ON health_metrics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health metrics"
  ON health_metrics FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own health metrics"
  ON health_metrics FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own goals"
  ON user_goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON user_goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON user_goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON user_goals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);