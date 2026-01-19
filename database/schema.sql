-- Users are handled by Supabase Auth

-- Table: monitored_urls
CREATE TABLE monitored_urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  url TEXT NOT NULL,
  interval_minutes INT NOT NULL,
  expected_status INT DEFAULT 200,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- Table: uptime_logs
CREATE TABLE uptime_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url_id UUID REFERENCES monitored_urls(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('UP', 'DOWN')),
  response_time INT,
  status_code INT,
  checked_at TIMESTAMP DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_monitored_urls_user_id ON monitored_urls(user_id);
CREATE INDEX idx_uptime_logs_url_id ON uptime_logs(url_id);
CREATE INDEX idx_uptime_logs_checked_at ON uptime_logs(checked_at);

-- Row Level Security
ALTER TABLE monitored_urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE uptime_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own URLs" ON monitored_urls
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own URLs" ON monitored_urls
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own URLs" ON monitored_urls
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own URLs" ON monitored_urls
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view logs for own URLs" ON uptime_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM monitored_urls 
      WHERE monitored_urls.id = uptime_logs.url_id 
      AND monitored_urls.user_id = auth.uid()
    )
  );