import axios from 'axios'
import { DatabaseService } from '../database/database'
import { MonitoredUrl } from '../../types/database'

export class MonitoringService {
  private db = new DatabaseService()

  async checkUrl(url: MonitoredUrl) {
    const startTime = Date.now()
    
    try {
      const response = await axios.get(url.url, {
        timeout: 30000,
        validateStatus: () => true
      })
      
      const responseTime = Date.now() - startTime
      const isUp = response.status === url.expected_status
      
      await this.db.logUptimeCheck(
        url.id,
        isUp ? 'UP' : 'DOWN',
        responseTime,
        response.status
      )
      
      return { status: isUp ? 'UP' : 'DOWN', responseTime, statusCode: response.status }
    } catch (error) {
      const responseTime = Date.now() - startTime
      
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