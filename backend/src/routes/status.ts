import { Router, Request, Response } from 'express'
import { DatabaseService } from '../services/database/database'

const router = Router()
const db = new DatabaseService()

// GET /api/status/:userId - Public status page for a user
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    
    const monitors = await db.getMonitoredUrls(userId)
    
    // Get latest status for each monitor
    const monitorsWithStatus = await Promise.all(
      monitors.map(async (monitor) => {
        const logs = await db.getUptimeLogs(monitor.id, 100)
        const latestLog = logs[0]
        const upCount = logs.filter(log => log.status === 'UP').length
        const uptime = logs.length > 0 ? Math.round((upCount / logs.length) * 100) : 0
        
        return {
          ...monitor,
          currentStatus: latestLog?.status || 'UNKNOWN',
          uptime,
          lastChecked: latestLog?.checked_at
        }
      })
    )
    
    res.json(monitorsWithStatus)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch status' })
  }
})

export default router