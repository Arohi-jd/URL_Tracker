export type MonitorRecord = {
  id: string;
  user_id: string;
  url: string;
  interval_minutes: number;
  is_active: boolean;
  last_checked: string | null;
  last_status: 'up' | 'down' | 'unknown';
  created_at: string;
};

export type StatusLog = {
  id: number;
  url_id: string;
  ts: string;
  status: 'up' | 'down';
  response_time_ms: number | null;
  error: string | null;
};
