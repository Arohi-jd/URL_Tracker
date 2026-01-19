import { supabase } from './supabase'
import { MonitoredUrl, UptimeLog } from '../../types/database'

export class DatabaseService {
  async createMonitoredUrl(userId: string, url: string, intervalMinutes: number, expectedStatus = 200) {
    const { data, error } = await supabase
      .from('monitored_urls')
      .insert({ user_id: userId, url, interval_minutes: intervalMinutes, expected_status: expectedStatus })
      .select()
      .single()
    
    if (error) throw error
    return data as MonitoredUrl
  }

  async getMonitoredUrls(userId: string) {
    const { data, error } = await supabase
      .from('monitored_urls')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
    
    if (error) throw error
    return data as MonitoredUrl[]
  }

  async getAllActiveUrls() {
    const { data, error } = await supabase
      .from('monitored_urls')
      .select('*')
      .eq('is_active', true)
    
    if (error) throw error
    return data as MonitoredUrl[]
  }

  async logUptimeCheck(urlId: string, status: 'UP' | 'DOWN', responseTime: number, statusCode: number) {
    const { error } = await supabase
      .from('uptime_logs')
      .insert({ url_id: urlId, status, response_time: responseTime, status_code: statusCode })
    
    if (error) throw error
  }

  async getUptimeLogs(urlId: string, limit = 100) {
    const { data, error } = await supabase
      .from('uptime_logs')
      .select('*')
      .eq('url_id', urlId)
      .order('checked_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data as UptimeLog[]
  }

  async getMonitoredUrlWithUser(urlId: string) {
    const { data, error } = await supabase
      .from('monitored_urls')
      .select('*, user_email:user_id')
      .eq('id', urlId)
      .single()
    
    if (error) throw error
    return data
  }

  async getLastLog(urlId: string) {
    const { data, error } = await supabase
      .from('uptime_logs')
      .select('*')
      .eq('url_id', urlId)
      .order('checked_at', { ascending: false })
      .limit(1)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }
}