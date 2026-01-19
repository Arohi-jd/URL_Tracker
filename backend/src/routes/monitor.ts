import { Router, Response } from 'express'
import { DatabaseService } from '../services/database/database'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
const db = new DatabaseService()

// POST /api/monitor - Add a new URL to monitor
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { url, interval_minutes = 5, expected_status = 200 } = req.body
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' })
    }

    const monitor = await db.createMonitoredUrl(req.userId!, url, interval_minutes, expected_status)
    res.status(201).json(monitor)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create monitor' })
  }
})

// GET /api/monitor - Get all URLs for the logged-in user
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const monitors = await db.getMonitoredUrls(req.userId!)
    res.json(monitors)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch monitors' })
  }
})

// GET /api/logs/:urlId - Get uptime logs for a specific URL
router.get('/logs/:urlId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { urlId } = req.params
    const { limit = 100 } = req.query
    
    const logs = await db.getUptimeLogs(urlId, Number(limit))
    res.json(logs)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch logs' })
  }
})

export default router