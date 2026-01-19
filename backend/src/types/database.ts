export interface MonitoredUrl {
  id: string
  user_id: string
  url: string
  interval_minutes: number
  expected_status: number
  is_active: boolean
  created_at: string
}

export interface UptimeLog {
  id: string
  url_id: string
  status: 'UP' | 'DOWN'
  response_time: number
  status_code: number
  checked_at: string
}