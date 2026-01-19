import axios from 'axios'
import { DatabaseService } from '../database/database'
import { MonitoredUrl } from '../../types/database'
import { AlertService } from '../../utils/alert'

export class MonitoringService {
  private db = new DatabaseService()
  private alerts = new AlertService()

  async checkUrl(url: MonitoredUrl) {
    const startTime = Date.now()
    
    try {
      const response = await axios.get(url.url, {
        timeout: 30000,
        validateStatus: () => true
      })
      
      const responseTime = Date.now() - startTime
      const isUp = response.status === url.expected_status
      
      // Check if status changed from UP to DOWN
      if (!isUp) {
        const lastLog = await this.db.getLastLog(url.id)
        if (!lastLog || lastLog.status === 'UP') {
          // Status changed to DOWN, send alert
          const urlWithUser = await this.db.getMonitoredUrlWithUser(url.id)
          if (urlWithUser?.user_email) {
            await this.alerts.sendDownAlert(url, response.status, responseTime, urlWithUser.user_email)
          }
        }
      }
      
      await this.db.logUptimeCheck(
        url.id,
        isUp ? 'UP' : 'DOWN',
        responseTime,
        response.status
      )
      
      return { status: isUp ? 'UP' : 'DOWN', responseTime, statusCode: response.status }
    } catch (error) {
      const responseTime = Date.now() - startTime
      
      // Check if this is a new DOWN status
      const lastLog = await this.db.getLastLog(url.id)
      if (!lastLog || lastLog.status === 'UP') {
        const urlWithUser = await this.db.getMonitoredUrlWithUser(url.id)
        if (urlWithUser?.user_email) {
          await this.alerts.sendDownAlert(url, 0, responseTime, urlWithUser.user_email)
        }
      }
      
      await this.db.logUptimeCheck(url.id, 'DOWN', responseTime, 0)
      
      return { status: 'DOWN', responseTime, statusCode: 0 }
    }
  }

  async checkAllUrls() {
    const urls = await this.db.getAllActiveUrls()
    const results = await Promise.all(urls.map(url => this.checkUrl(url)))
    return results
  }
}