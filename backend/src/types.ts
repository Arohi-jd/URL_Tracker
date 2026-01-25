export type UUID = string;

export type MonitorRecord = {
  id: UUID;
  user_id: UUID;
  url: string;
  interval_minutes: number;
  is_active: boolean;
  last_checked: string | null;
  last_status: 'up' | 'down' | 'unknown';
  created_at: string;
};

export type StatusLog = {
  id: number;
  url_id: UUID;
  ts: string;
  status: 'up' | 'down';
  response_time_ms: number | null;
  error: string | null;
};
