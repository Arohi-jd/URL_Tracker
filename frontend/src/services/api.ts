import axios from 'axios'
import { MonitoredUrl, UptimeLog } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_URL,
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('supabase.auth.token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const apiService = {
  async getMonitors(): Promise<MonitoredUrl[]> {
    const { data } = await api.get('/api/monitor')
    return data
  },

  async createMonitor(url: string, interval_minutes = 5, expected_status = 200): Promise<MonitoredUrl> {
    const { data } = await api.post('/api/monitor', { url, interval_minutes, expected_status })
    return data
  },

  async getLogs(urlId: string, limit = 100): Promise<UptimeLog[]> {
    const { data } = await api.get(`/api/monitor/logs/${urlId}?limit=${limit}`)
    return data
  },

  async getPublicStatus(userId: string): Promise<any[]> {
    const { data } = await axios.get(`${API_URL}/api/status/${userId}`)
    return data
  }
}