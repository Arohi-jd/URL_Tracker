export interface Monitor {
  id: string
  user_id: string
  url: string
  name: string
  interval: number
  created_at: string
  is_active: boolean
}

export interface Check {
  id: string
  monitor_id: string
  status: 'up' | 'down'
  response_time: number
  status_code?: number
  error_message?: string
  checked_at: string
}

export interface Incident {
  id: string
  monitor_id: string
  started_at: string
  resolved_at?: string
  status: 'ongoing' | 'resolved'
}