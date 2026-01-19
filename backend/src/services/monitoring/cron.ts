import * as cron from 'node-cron'
import { MonitoringService } from './monitoring'

export class CronService {
  private monitoring = new MonitoringService()

  start() {
    // Run every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      console.log('Running URL checks...')
      try {
        await this.monitoring.checkAllUrls()
        console.log('URL checks completed')
      } catch (error) {
        console.error('Error during URL checks:', error)
      }
    })
    
    console.log('Cron scheduler started - checking URLs every 5 minutes')
  }
}